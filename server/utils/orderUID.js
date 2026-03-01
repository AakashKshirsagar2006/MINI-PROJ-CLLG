const Order = require('../model/order-model');
const ArchivedOrder = require('../model/archived-order-model');

/**
 * auto-incrementing 5-digit UID (e.g., 00001, 00045)
 * Automatically resets to 00001 every day at midnight.
 * Scans BOTH active and archived collections to prevent duplicates.
 */
async function createOrderUID() {
  // exact timestamp for midnight of the current day
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  // 1. Check the Active Orders collection for today
  // FIX: Sort by orderUID directly instead of _id to handle out-of-order kitchen serving!
  const lastActive = await Order.findOne({ 
      paidAt: { $gte: startOfDay },
      orderUID: { $ne: null } 
    })
    .sort({ orderUID: -1 }) 
    .select('orderUID');

  // 2. Check the Archived Orders collection for today
  const lastArchived = await ArchivedOrder.findOne({ 
      paidAt: { $gte: startOfDay },
      orderUID: { $ne: null } 
    })
    .sort({ orderUID: -1 }) 
    .select('orderUID');

  let maxNum = 0;

  // Extract the number from the active collection (if it exists)
  if (lastActive && lastActive.orderUID) {
    const activeNum = parseInt(lastActive.orderUID, 10);
    if (!isNaN(activeNum)) maxNum = Math.max(maxNum, activeNum);
  }

  // Extract the number from the archived collection (if it exists)
  if (lastArchived && lastArchived.orderUID) {
    const archivedNum = parseInt(lastArchived.orderUID, 10);
    if (!isNaN(archivedNum)) maxNum = Math.max(maxNum, archivedNum);
  }

  // Increment from the absolute highest numerical token found today
  const nextNum = maxNum + 1;

  // Pad with leading zeros to guarantee 5 digits (e.g., 00006)
  return nextNum.toString().padStart(5, '0');
}

module.exports = createOrderUID;