const express = require('express');
const Order = require('../model/order-model');
const mongoose = require('mongoose');
const archiveOrder = require('../utils/archive-mover'); // 👈 IMPORT THE HELPER

const router = express.Router();

// Middleware: Verify Staff or Admin
router.use((req, res, next) => {
  const user = req.session.user;
  if (!user) return res.status(401).json({ message: "Unauthenticated" });
  console.log("Authenticated user:", user);
  // Allow both Admin and Staff to perform these actions
  if (user.user_type !== 'admin' && user.user_type !== 'staff') {
    return res.status(403).json({ message: "Unauthorized" });
  }
  next();
});

// GET: Fetch Active Orders (Pending/Preparing/Ready)
router.get("/active-orders", async (req, res) => {
  try {
    const activeOrders = await Order.find({
      // Kept "PREPARING" here just in case any old orders are stuck in the DB
      fullfillment_status: { $in: ["PENDING", "PREPARING", "READY"] }
    });
    return res.json({ activeOrders });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// POST: Move Order to PREPARING or READY (Status Update Only)
router.post("/process-order", async (req, res) => {
  const { orderId, fullfillment_status } = req.body;
  
  if (!orderId || !mongoose.Types.ObjectId.isValid(orderId)) {
    return res.status(400).json({ message: "Bad Request" });
  }

  // This perfectly handles our new direct jump to "READY"
  if (!["PREPARING", "READY"].includes(fullfillment_status)) {
    return res.status(400).json({ message: "Invalid Status" });
  }

  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      { _id: orderId },
      { $set: { fullfillment_status: fullfillment_status } }
    );

    if (!updatedOrder) return res.status(404).json({ message: "Order not found" });

    return res.status(200).json({ message: "Status updated successfully!" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Update failed" });
  }
});

// POST: Verify OTP and MARK AS SERVED (This triggers the Archive!)
router.post("/fullfill-order", async (req, res) => {
  // Still extracting orderOTP so the frontend payload doesn't crash it
  const { orderId, orderOTP } = req.body;

  if (!orderId) {
    return res.status(400).json({ message: "Order ID is required" });
  }

  try {
    // 1. Fetch Order
    const activeOrder = await Order.findById(orderId);
    
    if (!activeOrder) {
      return res.status(404).json({ message: "Order does not exist" });
    }

    if (activeOrder.fullfillment_status !== "READY") {
      return res.status(400).json({ message: "Order must be READY before serving" });
    }

    // ==========================================
    // 🛑 OTP CHECK HAS BEEN BYPASSED 🛑
    // ==========================================
    // if (String(orderOTP) !== String(activeOrder.orderOTP)) {
    //   return res.status(403).json({ message: "Incorrect OTP. Please ask user to check again." });
    // }

    // 2. We move to Archive directly without checking OTP!
    const success = await archiveOrder(orderId, "SERVED");

    if (success) {
      return res.status(200).json({ message: "Order Served & Archived Successfully!" });
    } else {
      return res.status(500).json({ message: "Failed to archive order. Please try again." });
    }

  } catch (err) {
    console.error("Fulfillment Error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;