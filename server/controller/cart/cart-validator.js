function validateCartSession(req, res, next) {
  const cart = req.session.cart;
  if (!cart) return next();

  if (new Date() > cart.expiresAt) {
    delete req.session.cart;

    if (req.method === "GET") {
      return res.status(200).json({ items: [] });
    }

    return res.status(410).json({ errors: ["Cart session expired"] });
  }

  next();
}

module.exports = validateCartSession;