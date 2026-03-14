const mongoose = require('mongoose');
const Order = require('../model/order-model');
const ArchivedOrder = require('../model/archived-order-model');
const FoodItems = require('../model/food-item-model');

/**
 * Moves an order from Active -> Archive
 * @param {string} orderId - The MongoDB ID of the order
 * @param {string} finalStatus - e.g. "SERVED", "CANCELLED", "EXPIRED"
 */
const archiveOrder = async (orderId, finalStatus) => {
    const session = await mongoose.startSession();
    try {
        session.startTransaction();

        // 1. Find the order in the 'orders' collection
        const order = await Order.findById(orderId).session(session);
        if (!order) {
            throw new Error("Order not found in Active list");
        }

        // 2. Prepare data for the Archive
        const orderData = order.toObject();
        delete orderData._id; // Let Mongo create a new ID for the archive
        
        // Update the status before saving
        orderData.fullfillment_status = finalStatus; 
        
        // --- INDUSTRY-GRADE STOCK DEDUCTION ---
        // If the order has physically left the kitchen (SERVED), it should permanently deduct stock.
        if (finalStatus === "SERVED") {
            for (const item of order.items) {
                 await FoodItems.updateOne(
                     { _id: item.foodItemId }, 
                     { $inc: { quantity: -item.qty, locked_quantity: -item.qty } }, 
                     { session }
                 );
            }
        }
        // ----------------------------------------
        
        // 3. Save to 'archivedorders' collection
        await new ArchivedOrder(orderData).save({ session });

        // 4. Delete from 'orders' collection
        await Order.findByIdAndDelete(orderId).session(session);

        // 5. Commit (Save Everything)
        await session.commitTransaction();
        console.log(`✅ Moved Order ${orderId} to Archive (Status: ${finalStatus})`);
        return true;

    } catch (err) {
        await session.abortTransaction();
        console.error(`❌ Archiving Failed:`, err.message);
        return false;
    } finally {
        session.endSession();
    }
};

module.exports = archiveOrder;