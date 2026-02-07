const mongoose = require("mongoose");

// We copy the Schema exactly so the data fits perfectly
const ArchivedOrderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    userName: { type: String, default: "User" },
    userEmail: { type: String, required: true },
    items: [
      {
        foodItemId: { type: mongoose.Schema.Types.ObjectId, ref: "FoodItem", required: true },
        name: String,             
        price: Number,            
        qty: Number,               
      }
    ],
    amount: { type: Number, required: true },
    currency: { type: String, default: "INR" },
    
    // We keep status fields to know what happened
    status: { type: String }, 
    paymentProvider: { type: String, default: "RAZORPAY" },
    razorpayOrderId: { type: String, default: null },
    razorpayPaymentId: { type: String, default: null },
    
    fullfillment_status: { type: String }, // e.g. "SERVED" or "CANCELLED"
    
    orderUID: { type: String, default: null }, 
    orderOTP: { type: String, default: null },          
    
    createdAt: Date,  // When they ordered
    paidAt: Date,     // When they paid
    
    // EXTRA FIELD: To know when we moved it here
    archivedAt: { type: Date, default: Date.now } 
  },
  { versionKey: false }
);

// THIS IS THE KEY: We tell Mongo to save this in 'archivedorders' collection
module.exports = mongoose.model("ArchivedOrder", ArchivedOrderSchema);