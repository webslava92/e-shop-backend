const uuid = require("uuid");
const path = require("path");
const fs = require("fs");
const { ProductModel, ProductInfoModel } = require("../models/models");
const ApiError = require("../exceptions/ApiError");

class ProductService {
  async create(name, price, typeId, brandId, info, img) {
    let product = await ProductModel.findOne({ where: { name } });
    if (product) {
      throw ApiError.BadRequest(
        `Товар: ${name}, уже существует. Укажите другое наименование`
      );
    }

    let fileName = uuid.v4() + ".jpg";
    img.mv(path.resolve(__dirname, "..", "static", fileName));

    product = await ProductModel.create({
      name,
      price,
      typeId,
      brandId,
      img: fileName,
    });

    if (info) {
      info = JSON.parse(info);
      info.forEach((i) =>
        ProductInfoModel.create({
          title: i.title,
          description: i.description,
          productId: product.id,
        })
      );
    }

    return product;
  }

  async getAll({ typeId, brandId, limit, page, order }) {
    let offset = page * limit - limit;
    let products;
    if (!typeId || !brandId) {
      products = await ProductModel.findAndCountAll({
        offset,
        limit,
        order,
      });
    }

    if (typeId && brandId) {
      products = await ProductModel.findAndCountAll({
        where: { typeId, brandId },
        limit,
        offset,
        order,
      });
    }

    if (typeId) {
      products = await ProductModel.findAndCountAll({
        where: { typeId },
        limit,
        offset,
        order,
      });
    }

    if (brandId) {
      products = await ProductModel.findAndCountAll({
        where: { brandId },
        limit,
        offset,
        order,
      });
    }

    return products;
  }

  async getOne(id) {
    const product = await ProductModel.findOne({
      where: { id },
      include: [{ model: ProductInfoModel, as: "info" }],
    });
    return product;
  }

  async edit(id, name, price, typeId, brandId, info, fileName) {
    const product = await ProductModel.findOne({ where: { id } });
    if (!product) {
      throw ApiError.BadRequest(`Товар с id: ${id}, не найден`);
    }

    if (info) {
      let productInfo = await ProductInfoModel.findOne({
        where: { productId: info.productId },
      });
      info = JSON.parse(info);
      if (!productInfo) {
        info.forEach((i) =>
          ProductInfoModel.create({
            title: i.title,
            description: i.description,
            productId: product.id,
          })
        );
        productInfo = await info.save().then(() => info);
      }
      let newInfo = info.forEach((i) =>
        ProductInfoModel.create({
          title: i.title,
          description: i.description,
          productId: product.id,
        })
      );
    }

    if (name) product.name = name;
    if (price) product.price = price;
    if (typeId) product.typeId = typeId;
    if (brandId) product.brandId = brandId;
    if (productInfo) product.info = productInfo;
    if (fileName) product.img = fileName;

    const updatedProduct = await product.save().then(() => product);

    return updatedProduct;
  }

  async delete(id) {
    const product = await ProductModel.findOne({
      where: { id },
    });
    if (!product) {
      throw ApiError.BadRequest(`Товар с id: ${id}, не найден`);
    }
    await ProductModel.destroy({
      where: { id },
    });
  }
}

module.exports = new ProductService();
