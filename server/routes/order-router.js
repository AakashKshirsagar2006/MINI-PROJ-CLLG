require('dotenv').config();

const Razorpay = require("razorpay");
const express = require('express');
const mongoose = require('mongoose');
const Order = require('../model/order-model');
const FoodItems = require('../model/food-item-model');
const ArchivedOrder = require('../model/archived-order-model');


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
  
  try {
    session.startTransaction();
    const existingOrder = await Order.findOne({ userId, status: "CREATED" }, null, { session });
    
    if (existingOrder) {
        if (existingOrder.expiresAt > new Date()) {
            await session.abortTransaction();
            session.endSession();
            
            // 🛑 SAFETY FIX: If Razorpay ID failed to generate last time, prevent crash
            if (!existingOrder.razorpayOrderId) {
                 return res.status(400).json({ message: "Payment setup failed previously. Please cancel this order in My Orders." });
            }

            // ✅ SUCCESS: Return existing order details + razorpay keys to reopen popup
            return res.status(200).json({ 
              orderDetails: existingOrder,
              razorpay: {
                orderId: existingOrder.razorpayOrderId,
                amount: existingOrder.amount * 100,
                currency: existingOrder.currency
              }
            });
        }
        
        // If existing order is expired, unlock items
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
      const food = await FoodItems.findOne({ _id: item.foodItemId }, null, { session });
      if (!food) continue;

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
    
    // Create the Order
    const [order] = await Order.create(
      [
        {
          userId,
          userName: req.session.user.name,
          userEmail: req.session.user.email,
          items: lockedItems,
          amount: totalAmount,
          status: "CREATED",
          paymentProvider: "RAZORPAY",
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


// FOR PAST ORDERS ye dono check krega (History from Archive + Active)
router.get("/past-orders", async (req, res) => {
  const user = req.session.user;
  if (!user) return res.status(401).json({ message: "Unauthenticated" });

  try {
    const userId = user._id;

    // 1. Fetch History from ARCHIVE
    const archivedOrders = await ArchivedOrder.find({ userId })
      .sort({ createdAt: -1 })
      .limit(10);

    // 2. Fetch History from ACTIVE (Recent failures/cancellations)
    const activeHistory = await Order.find({
      userId,
      status: { $in: ["CANCELLED", "EXPIRED", "FAILED"] } 
    }).sort({ createdAt: -1 }).limit(5);

    // 3. Merge Both Lists
    const allHistory = [...activeHistory, ...archivedOrders];

    // 4. Sort and Slice
    allHistory.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    const finalHistory = allHistory.slice(0, 10);

    // 5. Transform data for Frontend
    const formattedOrders = finalHistory.map((order) => {
      const dateObj = new Date(order.createdAt);
      const dateString = dateObj.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short"
      });

      const itemsString = order.items.map((i) => i.name).join(", ");

      // --- LOGIC FIX HERE ---
      let uiStatus = "Completed"; // Default for served orders
      
      if (order.status === "CANCELLED") uiStatus = "Cancelled";
      else if (order.status === "EXPIRED") uiStatus = "Expired";
      else if (order.status === "FAILED") uiStatus = "Failed";
      
      // If it's PAID and SERVED (from Archive), we show "Completed" to the user
      
      const displayId = order.orderUID
        ? `#${order.orderUID}`
        : `#OD-${order._id.toString().slice(-4).toUpperCase()}`;

      return {
        id: displayId,
        date: dateString,
        items: itemsString,
        total: order.amount,
        status: uiStatus
      };
    });

    return res.json({ pastOrders: formattedOrders });

  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: err.message });
  }
});

// ==========iske baad stats wala route hai jo ki dono jagah se data lekar user ko total spent aur total orders batayega (Active + Archive) ==========
// GET USER STATS (Fast Aggregation)
router.get("/stats", async (req, res) => {
  if (!req.session.user) return res.status(401).json({ message: "Unauthenticated" });
  
  try {
    const userId = new mongoose.Types.ObjectId(req.session.user._id);

    // 1. Calculate from ARCHIVE (History)
    // Only count orders that were actually SERVED (money spent)
    const archiveStats = await ArchivedOrder.aggregate([
      { $match: { userId: userId, fullfillment_status: "SERVED" } },
      {
        $group: {
          _id: null,
          totalSpent: { $sum: "$amount" },
          totalOrders: { $sum: 1 }
        }
      }
    ]);

    // 2. Calculate from ACTIVE (Current)
    // Only count orders that are PAID (money currently locked)
    const activeStats = await Order.aggregate([
      { $match: { userId: userId, status: "PAID" } },
      {
        $group: {
          _id: null,
          totalSpent: { $sum: "$amount" },
          totalOrders: { $sum: 1 }
        }
      }
    ]);

    // 3. Combine Them
    const archived = archiveStats[0] || { totalSpent: 0, totalOrders: 0 };
    const active = activeStats[0] || { totalSpent: 0, totalOrders: 0 };

    return res.json({
      totalSpent: archived.totalSpent + active.totalSpent,
      totalOrders: archived.totalOrders + active.totalOrders
    });

  } catch (err) {
    console.error("Stats Error:", err);
    return res.status(500).json({ message: "Error fetching stats" });
  }
});


module.exports = router;