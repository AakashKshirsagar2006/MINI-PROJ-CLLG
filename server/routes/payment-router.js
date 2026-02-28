const express = require("express");
const crypto = require("crypto");
const Order = require("../model/order-model");
const PaymentDetails = require("../model/payment-details-model"); 
const createOrderUID = require("../utils/orderUID");

const router = express.Router();

// ==========================================
// 1. GET PAYMENT LOGS (For Admin Dashboard)
// ==========================================
router.get("/logs", async (req, res) => {
  // Security Check 
  if (!req.session.user || req.session.user.user_type !== 'admin') {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { search, type } = req.query; 

  try {
    const pipeline = [
      {
        $lookup: {
          from: "orders", 
          localField: "orderId",
          foreignField: "_id",
          as: "orderData"
        }
      },
      { $unwind: "$orderData" },
      { 
        $match: { 
           status: "succeeded" 
        } 
      },
      ...(search ? [{
          $match: { 
            "orderData.orderUID": { $regex: search, $options: "i" } 
          }
      }] : []),
      { $sort: { paymentDate: -1 } },
      { $limit: 50 } 
    ];

    const logs = await PaymentDetails.aggregate(pipeline);
    return res.json({ logs });

  } catch (err) {
    console.error("Error fetching payment logs:", err);
    return res.status(500).json({ message: "Failed to fetch logs" });
  }
});


// ==========================================
// 2. VERIFY ROUTE
// ==========================================
router.post("/verify", async (req, res) => {
  console.log("VERIFY ROUTE HIT FROM FRONTEND");

  if (!req.session.user) {
    return res.status(401).json({ message: "Unauthenticated" });
  }

  const {
    orderId,
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature
  } = req.body;

  if (!orderId || !razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return res.status(400).json({ message: "Invalid payload" });
  }

  const order = await Order.findById(orderId);
  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  if (order.status === "PAID") {
    console.log("Order was already paid via webhook. Returning 200 OK to frontend.");
    return res.status(200).json({
      message: "Payment verified successfully (handled by webhook)",
      orderId: order._id
    });
  }

  if (order.status !== "CREATED") {
    return res.status(400).json({ message: "Order cannot be processed" });
  }

  // --- SIGNATURE VERIFICATION ---
  const generatedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  if (generatedSignature !== razorpay_signature) {
    order.status = "FAILED";
    await order.save();
    return res.status(400).json({ message: "Payment verification failed" });
  }

  // PAYMENT VERIFIED BY FRONTEND (Webhook was slow)
  order.status = "PAID";
  order.razorpayPaymentId = razorpay_payment_id;
  order.razorpaySignature = razorpay_signature;
  order.paidAt = new Date();
  order.fullfillment_status = "PENDING";
  
  // FIX: Assign the 00001 Token if frontend verifies first!
  order.orderUID = await createOrderUID();
  
  // OTP IS BYPASSED HERE FOR THE NEW WORKFLOW

  await order.save();

  return res.status(200).json({
    message: "Payment verified successfully by frontend",
    orderId: order._id
  });
});

module.exports = router;