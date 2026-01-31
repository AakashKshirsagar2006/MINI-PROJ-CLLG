const crypto = require('crypto');
const Order = require('../model/order-model');

function generateRandomUID() {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  
  
  const char1 = letters.charAt(crypto.randomInt(0, 26));
  const char2 = letters.charAt(crypto.randomInt(0, 26));
  
  // Get a random number between 0 and 9999
  const num = crypto.randomInt(0, 10000);
  
  // Format string
  return `${char1}${char2}${num.toString().padStart(4, '0')}`;
}

/**
 * High-level function to ensure uniqueness
 */
async function createOrderUID(db) {
  let unique = false;
  let uid = '';
  let attempts = 0;

  while (!unique&&attempts<100) {
    uid = generateRandomUID();
    const exists = await Order.findOne({orderUID:uid, fullfillment_status:{$in:["PENDING","PREPARING","READY"]}});

    if (!exists) {
      unique = true;
    } else {
      attempts++;
    }
  }

  if (!unique) throw new Error('Failed to generate unique ID after 5 attempts');
  
  return uid;
}

module.exports = createOrderUID;


