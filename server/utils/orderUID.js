const Order = require('../model/order-model');

/**
 * auto-incrementing 5-digit UID (e.g., 00001, 00045)
 * Automatically resets to 00001 every day at midnight.
 */
async function createOrderUID() {
  //exact timestamp for midnight of the current day
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  //Query DB for the  latest order placed TODAY
  // Using sort({ _id: -1 }) is the fastest way to get the newest document in Mongo
  const lastOrder = await Order.findOne({ createdAt: { $gte: startOfDay } })
    .sort({ _id: -1 })
    .select('orderUID');

  //Increment logic
  let nextNum = 1;
  if (lastOrder && lastOrder.orderUID) {
    // Convert string '00045' to number 45, then add 1
    const lastNum = parseInt(lastOrder.orderUID, 10);
    if (!isNaN(lastNum)) {
      nextNum = lastNum + 1;
    }
  }

  // Pad with leading zeros to guarantee 5 digits
  return nextNum.toString().padStart(5, '0');
}

module.exports = createOrderUID;