const BasketService = require("../service/basketService");

class BasketController {
  async getOne(req, res, next) {
    try {
      const { refreshToken } = req.cookies;

      const basket = await BasketService.getOne(refreshToken);
      res.cookie("basketId", basket, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });

      return res.json(basket);
    } catch (e) {
      next(e);
    }
  }

  async append(req, res, next) {
    try {
      const { productId, quantity } = req.params;
      const { basketId, productsData, refreshToken } = req.cookies;
      if (refreshToken) {
        const basket = await BasketService.append(
          productId,
          quantity,
          basketId,
          productsData,
          refreshToken
        );

        res.cookie("basketId", basket, {
          maxAge: 30 * 24 * 60 * 60 * 1000,
          httpOnly: true,
        });
        res.cookie("productsData");

        return res.json(basket);
      }
    } catch (e) {
      next(e);
    }
  }

  async clear(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      const basket = await BasketService.clear(refreshToken);

      res.cookie("basketId");

      return res.json({ message: "Корзина успешно очищена" });
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new BasketController();
