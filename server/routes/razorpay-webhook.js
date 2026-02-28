const express = require("express");
const crypto = require("crypto");
const Order = require("../model/order-model");
const PaymentDetails = require("../model/payment-details-model");
const createOrderUID = require("../utils/orderUID");
const generateOrderOTP = require("../utils/orderOTP"); // Kept import, but bypassed below...agar future me OTP wapas lana ho to sirf ye line uncomment karni hai, baki code change karne ki zarurat nahi hai.

const router = express.Router();

router.post(
  "/razorpay",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    try {
      const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
      const receivedSignature = req.headers["x-razorpay-signature"];

      const expectedSignature = crypto
        .createHmac("sha256", secret)
        .update(req.body)
        .digest("hex");

      if (receivedSignature !== expectedSignature) {
        return res.status(400).send("Invalid signature");
      }

      const event = JSON.parse(req.body.toString());

      if (event.event === "payment.captured") {
        const payment = event.payload.payment.entity;

        const order = await Order.findOne({
          razorpayOrderId: payment.order_id
        });

        if (!order) return res.status(200).send("OK");

        if (order.status === "PAID") {
          return res.status(200).send("OK");
        }

        order.status = "PAID";
        order.razorpayPaymentId = payment.id;
        order.paidAt = new Date();
        order.fullfillment_status = "PENDING";
        
        //The daily 00001 token generator
        order.orderUID = await createOrderUID();
        
        //OTP Logic is explicitly bypassed based on management feedback
        // order.orderOTP = generateOrderOTP();
        
        await order.save();

        try {
          await new PaymentDetails({
            orderId: order._id,
            userId: order.userId,
            userName: order.userName, 
            userEmail: order.userEmail,
            transactionId: payment.id,
            paymentMethodId: payment.method,
            amount: payment.amount / 100, 
            currency: payment.currency,
            method: payment.method,
            status: "succeeded",
            paymentDate: new Date()
          }).save();
        } catch (logErr) {
          console.error("Payment log failed:", logErr);
        }
      }

      res.status(200).send("OK");

    } catch (err) {
      console.error("Webhook error:", err);
      res.status(500).send("Webhook failure");
    }
  }
);

module.exports = router;