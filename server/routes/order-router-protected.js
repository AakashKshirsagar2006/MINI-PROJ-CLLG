const express = require('express');
const Order = require('../model/order-model');
const mongoose = require('mongoose');

const router = express.Router();

router.use((req,res, next)=>{
  const user = req.session.user;
  if(!user) return res.status(400).json({message:"Unauthanticated"});
  if(user.type!=='admin' && user.user_type !== 'staff') return res.status(401).json({message:"Unauthorized"});
   next();
});

router.get("/active-orders",async(req, res)=>{
  
  try{
    const activeOrders = await Order.find({fullfillment_status:{$in:["PENDING","PREPARING","READY"]}});

  return res.json({activeOrders});
  }
  catch(err){
    console.log(err);
    return res.status(500).json({message:"Internal server error"});
  }
});

router.post("/process-order",async (req, res)=>{
  const {orderId, fullfillment_status} = req.body;
  console.log(orderId,fullfillment_status);
  
  if(!orderId || !mongoose.Types.ObjectId.isValid(orderId)) return res.status(400).json({message:"Bad Request"});

  if(!["PREPARING","READY"].includes(fullfillment_status)) return res.status(400).json({message:"Bad Request"});
  
  const updatedOrder = await Order.findByIdAndUpdate({_id:orderId},{$set:{fullfillment_status:fullfillment_status}});

  if(!updatedOrder) return res.status(400).json({message:"No such order exist"});

  return res.status(200).json({message:"Update successfully !"});
});

router.post("/fullfill-order",async (req, res)=>{
  console.log(req.body);
  const {orderId, orderOTP} = req.body;
  if(!orderId||!orderOTP) return res.status(400).json({message:"Bad Request"});
  const session = await mongoose.startSession();
 try{
  session.startTransaction();
  const activeOrder = await Order.findById({_id:orderId},null,{session});
  if (!activeOrder) throw { statusCode: 404, message: "Order does not exist" }; 
    
    if (activeOrder.fullfillment_status !== "READY") throw { statusCode: 400, message: "Order is not ready or already served" };

    if (orderOTP !== activeOrder.orderOTP) throw { statusCode: 403, message: "Order OTP is incorrect" };
    
  await Order.findOneAndUpdate({_id:orderId},{$set:{fullfillment_status:"SERVED"}},{session});
 await session.commitTransaction();
 session.endSession()
 return res.status(200).json({message:"Successfully processed request"});
}
catch(err){
  await session.abortTransaction();
  session.endSession();
  console.log(err);
 const statusCode = err.statusCode || 500;
 const message = err.message || "Internal server error";
 return res.status(statusCode).json({ message });
}
});

module.exports = router;