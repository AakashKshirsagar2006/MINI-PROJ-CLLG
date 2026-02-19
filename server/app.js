
require('dotenv').config();
const https = require('https');
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

const options = {
  key: fs.readFileSync(process.env.SSL_KEY),
  cert: fs.readFileSync(process.env.SSL_CERT)
};
const app = express();


app.use(cors({
  origin: [process.env.CORS_URI, "https://localhost:5173"],
  credentials: true                 
}));

//app.use("/payment", paymentRouter);
app.use("/webhook", require("./routes/razorpay-webhook"));
app.use(express.json())
app.use(express.urlencoded({extended:true}));
//app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/uploads', express.static('uploads')); // img ke liye static folder serve krne ke liye

app.use(session({
  name: 'college_canteen.sid',
  secret: 'made_by_Sigma_developer',
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
    //sameSite: 'none',
    secure: false
  }
}));

// === ROUTES ===

app.use('/auth',authRouter)
app.use(foodItemsRouter);

app.use('/cart',validateCartSession);
app.use(cartRouter);
app.use('/orders',orderRouter);
app.use("/payments", require("./routes/payment-router"));
app.use("/admin", analyticsRouter);
app.use('/admin', adminRouter); // added for admin actions like stock modification and adding food items
app.use('/protected',protectedOrderRouter);
mongoose.connect(process.env.MONGO_URI).then(()=>{
startCronJobs();

https.createServer(options,app).listen(3000,()=>{
  console.log("Server is listining at https://localhost:3000");
})
}).catch(err=>{
  console.log("Failed to connect with mongodb\n",err);
})
