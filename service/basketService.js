const TokenService = require("./tokenService");
const {
  BasketModel,
  UserModel,
  BasketProductModel,
  ProductModel,
} = require("../models/models");
const ApiError = require("../exceptions/ApiError");

class BasketService {
  async getOne(refreshToken) {
    if (!refreshToken) {
      return;
    }
    const userData = TokenService.validateRefreshToken(refreshToken);
    const tokenFromDb = await TokenService.findToken(refreshToken);
    if (!userData || !tokenFromDb) {
      throw ApiError.UnauthorizedError();
    }
    const user = await UserModel.findOne({ where: { id: userData.id } });

    let basket = await BasketModel.findOne({ where: { userId: user.id } });
    if (!basket) {
      basket = await BasketModel.create({ userId: user.id });
    }

    return basket.id;
  }

  async append(productId, quantity, basketId, productsData, refreshToken) {
    if (!refreshToken) {
      return;
    }
    const userData = TokenService.validateRefreshToken(refreshToken);
    const tokenFromDb = await TokenService.findToken(refreshToken);
    if (!userData || !tokenFromDb) {
      throw ApiError.UnauthorizedError();
    }
    const user = await UserModel.findOne({ where: { id: userData.id } });

    let basket = await BasketModel.findOne({ where: { userId: user.id } });
    if (!basket) {
      basket = await BasketModel.create({ userId: user.id });
    }

    let product;
    if (productId) {
      product = await ProductModel.findOne({
        where: {
          id: productId,
        },
      });
    }

    let basketProducts = await BasketProductModel.findOne({
      where: { basketId: basket.id },
    });
    if (!basketProducts) {
      basketProducts = await BasketProductModel.create({
        basketId: basket.id,
        productId: product.id,
        quantity,
      });
    }

    return basketProducts;
  }

  async clear(refreshToken) {
    if (!refreshToken) {
      throw ApiError.UnauthorizedError();
    }
    const userData = TokenService.validateRefreshToken(refreshToken);
    const tokenFromDb = await TokenService.findToken(refreshToken);
    if (!userData || !tokenFromDb) {
      throw ApiError.UnauthorizedError();
    }
    const user = await UserModel.findOne({ where: { id: userData.id } });
    let basket = await BasketModel.findOne({ where: { userId: user.id } });

    if (basket) {
      basket = await BasketModel.destroy({
        where: {
          userId: user.id,
        },
      });
    } else {
      throw ApiError.BadRequest(`Корзина, не найдена`);
    }

    return;
  }
}

module.exports = new BasketService();
