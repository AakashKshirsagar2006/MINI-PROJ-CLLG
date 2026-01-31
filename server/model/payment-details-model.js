const mongoose = require('mongoose');

const paymentDetailsSchema = mongoose.Schema({
 
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  
  userId:{
    type: mongoose.Schema.Types.ObjectId,
    default: null,
    ref: 'User'
  },

  userEmail:{
    type: String,
    default: ""
   
  },
  userName:{type:String, default:"User"},

  transactionId: { type: String, required: true }, 
  paymentMethodId: { type: String },               
  
  // Money Details
  amount: { type: Number, required: true },       
  currency: { type: String, required: true },     
  
  // Card/Bank Details
  provider: { type: String, default: 'Razorpay' },
  method: { type: String },                       
  cardBrand: { type: String },                     
  last4Digits: { type: String },                   
  
  // Timing
  status: { type: String, default: 'succeeded' },
  paymentDate: { type: Date, default: Date.now }, 
  
  
  receiptUrl: { type: String }                  
});


module.exports = mongoose.model('PaymentDetails',paymentDetailsSchema);