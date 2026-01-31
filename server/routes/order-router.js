require('dotenv').config();

const Razorpay = require("razorpay");
const express = require('express');
const mongoose = require('mongoose');
const Order = require('../model/order-model');
const FoodItems = require('../model/food-item-model');


const router = express.Router();
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

router.get('/my-orders', async (req, res) => {
  if (!req.session.user) return res.status(401).json({ message: "Unauthenticated" });
  const userId = req.session.user._id.toString();
  
  let existingOrder = null;

  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    
    existingOrder = await Order.findOne({ userId, status: "CREATED" }, null, { session });
    
    if (existingOrder) {

        if (existingOrder.expiresAt > new Date()) {
            await session.abortTransaction();
            session.endSession();
            return res.status(200).json({ orderDetails: existingOrder });
        }

        for (const item of existingOrder.items) {
             await FoodItems.updateOne({ _id: item.foodItemId }, { $inc: { locked_quantity: -item.qty } }, { session });
        }

        existingOrder.status = "EXPIRED";
        await existingOrder.save({ session });
        await session.commitTransaction();
        session.endSession();
        
        existingOrder = null; 
    } 
    else {
        await session.commitTransaction();
        session.endSession();
    }
  }
  catch(err){
    console.log(err);
    await session.abortTransaction(); 
    session.endSession();
    return res.status(500).json({ message: "Error fetching orders" });
  }

  
  if (!existingOrder) return res.status(200).json({ orderData: null });
  
  return res.status(200).json({ orderDetails: existingOrder, message: "Orders fetched successfully" });
});


  

router.post("/create", async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ message: "Unauthenticated" });
  }

  const userId = req.session.user._id;
  const { requestedOrderDetails } = req.body;

  const session = await mongoose.startSession();
  let paymentIntent = "";
  try {
    session.startTransaction();
    const existingOrder = await Order.findOne({ userId, status: "CREATED" }, null, { session });
    if (existingOrder) {

        if (existingOrder.expiresAt > new Date()) {
            await session.abortTransaction();
            session.endSession();
            return res.status(200).json({ orderDetails: existingOrder });
        }
        // if existing oreder is expired
        for (const item of existingOrder.items) {
             await FoodItems.updateOne({ _id: item.foodItemId }, { $inc: { locked_quantity: -item.qty } }, { session });
        }
        existingOrder.status = "EXPIRED";
        await existingOrder.save({ session });
    }

    // Lock items logic
    const lockedItems = [];
    let totalAmount = 0;

    for (const item of requestedOrderDetails) {
      const food = await FoodItems.findOne(
        { _id: item.foodItemId },
        null,
        { session }
      );

      if (!food) continue;

      // SAFETY FIX: Handle case where database might return undefined
      const currentLocked = food.locked_quantity || 0; 
      
      const availableQty = food.quantity - currentLocked;
      const lockQty = Math.min(Number(item.qty), availableQty);

      if (lockQty <= 0) continue;

      await FoodItems.updateOne(
        { _id: food._id },
        { $inc: { locked_quantity: lockQty } },
        { session }
      );

      lockedItems.push({
        foodItemId: food._id,
        name: food.name,
        price: Number(food.price),
        qty: lockQty 
      });

      totalAmount += lockQty * Number(food.price);
    }

    if (lockedItems.length === 0) {
      throw new Error("NO_ITEMS_AVAILABLE");
    }
    //Payment intent creation
    
    const [order] = await Order.create(
      [
        {
          userId,
          userName: req.session.user.name,
          userEmail: req.session.user.email,
          items: lockedItems,
          amount: totalAmount,
          status: "CREATED",              // IMPORTANT
          paymentProvider: "RAZORPAY",    // TEMP default
          expiresAt: new Date(Date.now() + 10 * 60 * 1000)
        }
      ],
      { session }
    );
  

    await session.commitTransaction();
    session.endSession();
    // -------- RAZORPAY (OUTSIDE TRANSACTION) --------
    const razorpayOrder = await razorpay.orders.create({
      amount: totalAmount * 100, // paise
      currency: "INR",
      receipt: `order_${order._id}`,
      payment_capture: 1
    });

    // Update Mongo order with Razorpay order ID
    order.razorpayOrderId = razorpayOrder.id;
    await order.save();
          return res.status(201).json({
            orderDetails: order,
            razorpay: {
              orderId: razorpayOrder.id,
              amount: razorpayOrder.amount,
              currency: razorpayOrder.currency
            }
          });

  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    console.log(err);
    return res.status(400).json({
      message: err.message || "Order creation failed"
    });
  }
});


router.delete("/cancel", async (req, res) => {
  console.log("Inside cancel order")
  if (!req.session.user) {
    return res.status(401).json({ message: "Unauthenticated" });
  }

  const userId = req.session.user._id;
  const { orderId } = req.body;

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const order = await Order.findOne(
      { _id: orderId, userId },
      null,
      { session }
    );

    if (!order) {
      throw new Error("ORDER_NOT_FOUND");
    }

    if (order.status !== "CREATED") {
      throw new Error("ORDER_CANNOT_BE_CANCELLED");
    }

    
    for (const item of order.items) {
      await FoodItems.updateOne(
        { _id: item.foodItemId },
        { $inc: { locked_quantity: -item.qty } },
        { session }
      );
    }

    
    order.status = "CANCELLED";
    order.cancelledAt = new Date();
    await order.save({ session });

    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({
      message: "Order cancelled successfully",
      orderId
    });

  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    console.log(err)
    return res.status(400).json({
      message: err.message || "Cancel order failed"
    });
  }
});



//For Active orders

router.get("/active-orders",async (req, res)=>{
 const user =  req.session.user;
 if(!user) return res.status(401).json({message:"Unauthanticated"});
 try{
   const activeOrders = await Order.find({userId:user._id, status:"PAID", fullfillment_status:{ $in:["PENDING", "PREPARING","READY"] }});
   if(!activeOrders) return res.json({activeOrders:[]});
   return res.json({activeOrders});
 }
 catch(err){
  console.log(err.message);
  res.status(500).json({message: err.message});
 }
})



module.exports = router;