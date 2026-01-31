const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
      required: true
    },

    userName:{
      type:String,
      default:"User"
    },

    userEmail:{
      type:String,
      required:true
    },

    items: [
      {
        foodItemId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "FoodItem",
          required: true
        },
        name: String,             
        price: Number,            
        qty: Number,               
      }
    ],

    amount: {
      type: Number,
      required: true
    },

    currency: {
      type: String,
      default: "INR"
    },

    status: {
      type: String,
      enum: [
        "CREATED",     // order created, payment not done
        "PAID",        // payment success
        "FAILED",      // payment failed
        "CANCELLED",   // user cancelled
        "EXPIRED"      // time expired
      ],
      default: "CREATED",
      index: true
    },
    paymentProvider: {
      type: String,
      enum: ["RAZORPAY"],
      default: "RAZORPAY"
    },

    razorpayOrderId: {
      type: String,
      default: null
    },

    razorpayPaymentId: {
      type: String,
      default: null
    },

    razorpaySignature: {
      type: String,
      default: null
    },


    fullfillment_status: {
      type: String,
      enum: [
        "NOT_ELIGIBLE",
        "PENDING",
        "PREPARING",  
        "READY",      
        "SERVED",                 
        "REFUNDABLE"          
      ],
      default:"NOT_ELIGIBLE",
      index: true
    },
      
    orderUID: { 
      type: String, 
      default: null
     }, 

    orderOTP: { 
      type: String, 
      default: null
     },           
    
    expiresAt: {
      type: Date,
      index: true
    },

    createdAt: {
      type: Date,
      default: Date.now
    },
    paidAt: Date
  },
  { versionKey: false }
);


module.exports = mongoose.model("Order", OrderSchema);