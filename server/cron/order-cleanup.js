const cron = require('node-cron');
const mongoose = require('mongoose');
const Order = require('../model/order-model'); 
const FoodItems = require('../model/food-item-model');

const cleanupJob = () => {
  
  cron.schedule('*/30 * * * *', async () => {
    console.log('Running Cron: Checking for expired created orders...');
    
    const session = await mongoose.startSession();
    try {
      session.startTransaction();

      
      const expiredOrders = await Order.find({
        status: 'CREATED',
        expiresAt: { $lt: new Date() } 
      }).session(session);

      if (expiredOrders.length === 0) {
        await session.commitTransaction();
        session.endSession();
        return;
      }

      console.log(`Found ${expiredOrders.length} expired orders to process.`);

      for (const order of expiredOrders) {
        for (const item of order.items) {
          await FoodItems.updateOne(
            { _id: item.foodItemId },
            { $inc: { locked_quantity: -item.qty } } 
          ).session(session);
        }

       
        order.status = 'EXPIRED';
        await order.save({ session });
      }

      await session.commitTransaction();
      console.log(`Successfully expired ${expiredOrders.length} orders and released inventory.`);
      
    } catch (err) {
      console.error(" Cron Job Error (Expiry):", err);
      await session.abortTransaction();
    } finally {
      session.endSession();
    }
  });

  
  cron.schedule('0 0 * * *', async () => {
    console.log(' Running Cron: Hard cleanup of old orders...');
    
    try {
      const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

      const result = await Order.deleteMany({
        status: { $in: ['CANCELLED', 'EXPIRED', 'FAILED'] },
        expiresAt: { $lt: twentyFourHoursAgo } 
      });

      console.log(`Deleted ${result.deletedCount} old archived orders.`);
    } catch (err) {
      console.error(" Cron Job Error (Hard Delete):", err);
    }
  });
};

module.exports = cleanupJob;