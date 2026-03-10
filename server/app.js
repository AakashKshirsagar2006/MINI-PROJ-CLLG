
require('dotenv').config();
const fs = require('fs');
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const session = require('express-session')
const MongoStore = require('connect-mongo').default;
const paymentRouter = require("./routes/payment-router");
const foodItemsRouter = require('./routes/food-item-router')
const authRouter = require('./routes/auth-router');
const cartRouter = require('./routes/cart-router');
const validateCartSession = require('./controller/cart/cart-validator');
const orderRouter = require('./routes/order-router');
const protectedOrderRouter = require('./routes/order-router-protected');
const startCronJobs = require('./cron/order-cleanup');
const analyticsRouter = require('./routes/analytics-router');
const adminRouter = require('./routes/admin-action-router');

const app = express();
//app.set('trust proxy', 1); // trust first proxy if behind a proxy (e.g., when deployed on platforms like Heroku or Render)


app.use(cors({
  origin: process.env.CORS_URI, 
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
}));

app.use("/uploads", express.static("uploads", {
  maxAge: "4d",   
}));


app.use("/webhook", require("./routes/razorpay-webhook"));
app.use(express.json())
app.use(express.urlencoded({extended:true}));
app.use('/uploads', express.static('uploads')); // img ke liye static folder serve krne ke liye

app.use(session({
  name: 'college_canteen.sid',
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,  
  store: new MongoStore({
     mongoUrl: process.env.MONGO_URI,
     ttl:14*24*60*60,
     autoRemove: 'native',
     touchAfter: 24 * 3600
     })
  ,
  rolling:true,
  cookie: {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 14, 
    sameSite: 'lax',
    secure: false,
  }
}));

// === ROUTES ===

app.use('/auth',authRouter)
app.use(foodItemsRouter);

app.use('/cart',validateCartSession);
app.use(cartRouter);
app.use('/orders',orderRouter);
app.use("/payments", require("./routes/payment-router"));
app.use('/admin/analytics', analyticsRouter);
app.use('/admin', adminRouter); // added for admin actions like stock modification and adding food items
app.use('/protected',protectedOrderRouter);

mongoose.connect(process.env.MONGO_URI).then(()=>{
startCronJobs();

app.listen(process.env.PORT,()=>{
  console.log("Server is listining at port",process.env.PORT);
})
}).catch(err=>{
  console.log("Failed to connect with mongodb\n",err);
})
