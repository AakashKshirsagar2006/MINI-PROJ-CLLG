
require('dotenv').config();

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
const app = express();


app.use(cors({
  origin: 'http://localhost:5173',   
  credentials: true                 
}));

//app.use("/payment", paymentRouter);
app.use("/webhook", require("./routes/razorpay-webhook"));
app.use(express.json())
app.use(express.urlencoded({extended:true}));

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


app.use('/auth',authRouter)
app.use(foodItemsRouter);

app.use('/cart',validateCartSession);
app.use(cartRouter);
app.use('/orders',orderRouter);
app.use("/payments", require("./routes/payment-router"));
app.use('/protected',protectedOrderRouter);
mongoose.connect(process.env.MONGO_URI).then(()=>{
startCronJobs();
app.listen(3000,()=>{
  console.log("Server is listining at http://localhost:3000");
})
}).catch(err=>{
  console.log("Failed to connect with mongodb\n",err);
})

