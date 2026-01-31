const express = require('express');
const FoodItems = require('../model/food-item-model')

const router = express.Router();
router.get('/food-items',async (req, res)=>{
  const foodItems = await FoodItems.find({});
  return res.status(200).json({foodItems});
})

module.exports = router;