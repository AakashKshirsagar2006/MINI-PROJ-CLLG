const express = require("express");
const crypto = require("crypto");
const Order = require("../model/order-model");
const PaymentDetails = require("../model/payment-details-model");
const createOrderUID = require("../utils/orderUID");
const generateOrderOTP = require("../utils/orderOTP");

const router = express.Router();

/*
  DHYAAN DE: Razorpay raw buffer bhejta hai, JSON nahi.
  Isliye hum yahan 'express.raw' use kar rahe hain.
  'express.json()' yahan kaam nahi karega kyunki woh signature verify fail karwa dega.
*/
router.post(
  "/razorpay",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    try {
      // 1. Secret aur Signature nikalo
      const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
      const receivedSignature = req.headers["x-razorpay-signature"];

      // 2. Signature Verify karo (Security Check)
      // Hum raw body ka hash banake check karte hain ki kya ye request sach mein Razorpay se aayi hai?
      const expectedSignature = crypto
        .createHmac("sha256", secret)
        .update(req.body)
        .digest("hex");

      if (receivedSignature !== expectedSignature) {
        // Agar signature match nahi hua, toh ye hacker ho sakta hai
        return res.status(400).send("Invalid signature");
      }

      // 3. Raw body ko JSON mein convert karo
      const event = JSON.parse(req.body.toString());

      // Hum sirf 'payment.captured' event mein interested hain
      if (event.event === "payment.captured") {
        const payment = event.payload.payment.entity;

        // Order dhundo DB mein using Razorpay Order ID
        const order = await Order.findOne({
          razorpayOrderId: payment.order_id
        });

        // SAFETY: Agar order nahi mila, toh bhi Razorpay ko 'OK' bol do
        // Taki woh bar-bar retry na kare.
        if (!order) return res.status(200).send("OK");

        // IDEMPOTENCY CHECK:
        // Agar order pehle se PAID hai, toh wapas process mat karo.
        if (order.status === "PAID") {
          return res.status(200).send("OK");
        }

        // 4. Order Update karo
        order.status = "PAID";
        order.razorpayPaymentId = payment.id;
        order.paidAt = new Date();
        order.fullfillment_status = "PENDING";
        order.orderUID = await createOrderUID();
        order.orderOTP = generateOrderOTP();
        
        await order.save();

        // 5. Payment Logs Save karo (Admin Panel ke liye)
        try {
          await new PaymentDetails({

            orderId: order._id,
            userId: order.userId,
            
            userName: order.userName, 
            userEmail: order.userEmail,
            transactionId: payment.id,
            paymentMethodId: payment.method,
            amount: payment.amount / 100, // Amount paise mein hota hai, isliye /100
            currency: payment.currency,
            method: payment.method,
            status: "succeeded",
            paymentDate: new Date()
          }).save();
        } catch (logErr) {
          // Agar log save fail bhi ho jaye, toh code crash mat hone do
          console.error("Payment log failed:", logErr);
        }
      }

      // 6. Razorpay ko Success Response bhejo
      res.status(200).send("OK");

    } catch (err) {
      console.error("Webhook error:", err);
      // Agar server crash hua, toh 500 bhejo taki Razorpay baad mein retry kare
      res.status(500).send("Webhook failure");
    }
  }
);

module.exports = router;