const express = require('express');
const mongoose = require('mongoose');
const FoodItems = require('../model/food-item-model');
const Order = require('../model/order-model'); 
const router = express.Router();

function toObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id) ? new mongoose.Types.ObjectId(id) : null;
}

router.post('/cart/add',async (req,res)=>{
  if(!req.body.itemID) return res.status(400).json({error:["Invalid request"]});
  const user = req.session.user;
  if(!user) return res.status(401).json({errors:["User is not logged in"]});
  const {itemID} = req.body;
   
  try{
    // --- BLOCKING LOGIC ---
    // Check if a CREATED order exists that has NOT expired yet.
    const pendingOrder = await Order.findOne({
        userId: user._id,
        status: "CREATED",
        expiresAt: { $gt: new Date() } //Only block if time is remaining
    });

    if (pendingOrder) {
        return res.status(409).json({ 
            errors: ["You have a pending order awaiting payment. Please complete or cancel it in 'My Orders'."] 
        });
    }
    // ----------------------------

    const itemObjectId = toObjectId(itemID);
    if(!itemObjectId) return res.status(400).json({errors:["Invalid food item"]});
    
    const dbResult = await FoodItems.findById(itemObjectId);
    if(!dbResult) return res.status(400).json({errors:["Invalid food item"]});

    if (!req.session.cart) {
        const expiresAt = new Date();
        expiresAt.setHours(24, 0, 0, 0);
        req.session.cart = {
            itemIDs: [itemID],
            expiresAt
        };

        req.session.cookie.maxAge = expiresAt.getTime() - Date.now();
        return res.status(200).json({item:dbResult});
    }
    // duplicates check karo
    if (req.session.cart.itemIDs.includes(itemID.toString())) {
        return res.status(200).json({ item: dbResult });
    }
    // cart limit check karo
    if (req.session.cart.itemIDs.length >=20) {
        return res.status(409).json({ errors: ["Cart limit exceeded"] });
    }

    // Add item to cart
    req.session.cart.itemIDs.push(dbResult._id.toString());
    res.status(200).json({item:dbResult});

  }
  catch(err){
    console.error("Error adding item to cart:", err);
    return res.status(500).json({errors:["Internal Server Error"]});
  }
});


router.get('/cart/get',async (req, res)=>{
  if (!req.session.cart) {
    return res.status(200).json({ items: [] });
  }

  const itemIDs = req.session.cart.itemIDs.map(id => toObjectId(id)).filter(id => id !== null);
  if (itemIDs.length === 0) {
    return res.status(200).json({ items: [] });
  }
  const items = await FoodItems.find({_id: { $in: itemIDs}});
  return res.status(200).json({ items: items });
});


router.delete('/cart/remove/:itemID', (req, res) => {
  if (!req.session.cart) {
    return res.status(200).json({ itemID: null });
  }

  const { itemID } = req.params;

  req.session.cart.itemIDs = req.session.cart.itemIDs.filter(
    item => item !== itemID
  );

  return res.status(200).json({ itemID });
});


router.delete('/cart/clear',(req, res)=>{
  const cartSession = req.session.cart;
  if(!cartSession)return res.status(400).json({errors:["Cart already empty"]});
  delete req.session.cart;
  res.status(200).json({ message: "Cart cleared" });
})

module.exports = router;