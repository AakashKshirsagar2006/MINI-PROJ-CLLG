// const Razorpay = require("razorpay");
// const express = require("express");
// const Order = require("../model/order-model");

// const router = express.Router();

// const razorpay = new Razorpay({
//   key_id: process.env.RAZORPAY_KEY_ID,
//   key_secret: process.env.RAZORPAY_KEY_SECRET
// });

// router.post("/create", async (req, res) => {
//   if (!req.session.user) {
//     return res.status(401).json({ error: "Unauthenticated" });
//   }

//   const { orderId } = req.body;

//   const order = await Order.findById(orderId);
//   if (!order) {
//     return res.status(404).json({ error: "Order not found" });
//   }

//   if (order.status !== "CREATED") {
//     return res.status(400).json({ error: "Invalid order state" });
//   }

//   const razorpayOrder = await razorpay.orders.create({
//     amount: Math.round(order.amount * 100),
//     currency: "INR",
//     receipt: order._id.toString()
//   });

//   order.razorpayOrderId = razorpayOrder.id;
//   await order.save();

//   res.json({
//     key: process.env.RAZORPAY_KEY_ID,
//     razorpayOrder
//   });
// });

// module.exports = router;

const express = require("express");
const crypto = require("crypto");
const Order = require("../model/order-model");

const router = express.Router();

router.post("/verify", async (req, res) => {
  console.log("VERIFY ROUTE HIT");

  if (!req.session.user) {
    return res.status(401).json({ message: "Unauthenticated" });
  }

  const {
    orderId, // Mongo order _id
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature
  } = req.body;

  if (
    !orderId ||
    !razorpay_order_id ||
    !razorpay_payment_id ||
    !razorpay_signature
  ) {
    return res.status(400).json({ message: "Invalid payload" });
  }

  const order = await Order.findById(orderId);
  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  if (order.status !== "CREATED") {
    return res.status(400).json({ message: "Order already processed" });
  }

  // 🔐 SIGNATURE VERIFICATION
  const generatedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  if (generatedSignature !== razorpay_signature) {
    order.status = "FAILED";
    await order.save();
    return res.status(400).json({ message: "Payment verification failed" });
  }

  // ✅ PAYMENT VERIFIED
  order.status = "PAID";
  order.razorpayPaymentId = razorpay_payment_id;
  order.razorpaySignature = razorpay_signature;
  order.paidAt = new Date();
  order.fullfillment_status = "PENDING";

  await order.save();

  return res.status(200).json({
    message: "Payment verified successfully",
    orderId: order._id
  });
});

module.exports = router;
