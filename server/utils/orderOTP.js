const crypto = require('crypto');

function generateOrderOTP() {
  return (crypto.randomInt(0, 1000000) + 1000000)
    .toString()
    .slice(-6);
}

module.exports = generateOrderOTP;
