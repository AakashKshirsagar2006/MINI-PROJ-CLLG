function validateCart(req) {
  const cart = req.session.cart;
  if (!cart) return null;

  if (Date.now() > cart.expiresAt.getTime()) {
    delete req.session.cart;
    return null;
  }
  return cart;
}

module.exports = validateCart;