
const express = require("express");
const crypto = require("crypto");
const Order = require("../model/order-model");
const PaymentDetails = require("../model/payment-details-model"); // Import this!

const router = express.Router();

// ==========================================
// 1. GET PAYMENT LOGS (For Admin Dashboard)
// ==========================================
router.get("/logs", async (req, res) => {
  // 1. Security Check (Uncomment when ready)
  if (!req.session.user || req.session.user.user_type !== 'admin') {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { search, type } = req.query; // type = 'payment' or 'refund'

  try {
    const pipeline = [
      // A. Join with 'orders' collection to get OrderUID
      {
        $lookup: {
          from: "orders", // Exact name of your orders collection in Mongo
          localField: "orderId",
          foreignField: "_id",
          as: "orderData"
        }
      },
      // B. Unwind the array (since lookup returns an array)
      { $unwind: "$orderData" },

      // C. Filter by Type (Payments vs Refunds)
      // Currently you only have 'succeeded' for payments. 
      // Later for refunds you might check status: 'refunded'
      { 
        $match: { 
           status: "succeeded" // Adjust this logic later when you add Refunds
        } 
      },

      // D. Search Logic (If search query is provided)
      ...(search ? [{
          $match: { 
            "orderData.orderUID": { $regex: search, $options: "i" } 
          }
      }] : []),

      // E. Sort by Date (Newest First)
      { $sort: { paymentDate: -1 } },

      // F. Limit (Optional: to prevent loading 1000s of rows)
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

  await order.save();

  return res.status(200).json({
    message: "Payment verified successfully by frontend",
    orderId: order._id
  });
});

module.exports = router;