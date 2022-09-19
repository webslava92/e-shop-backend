const uuid = require("uuid");
const path = require("path");
const ProductService = require("../service/productService");

class ProductController {
  async create(req, res, next) {
    try {
      let { name, price, typeId, brandId, info } = req.body;
      const { img } = req.files;
      let fileName = uuid.v4() + ".jpg";
      img.mv(path.resolve(__dirname, "..", "static", fileName));

      const product = await ProductService.create(
        name,
        price,
        typeId,
        brandId,
        info,
        fileName
      );

      return res.json(product);
    } catch (e) {
      next(e);
    }
  }
  async getAll(req, res, next) {
    try {
      let { limit, page, typeId, brandId, order } = req.query;

      const products = await ProductService.getAll({
        typeId,
        brandId,
        limit,
        page,
        order,
      });

      return res.json(products);
    } catch (e) {
      next(e)
    }
  }
  async getOne(req, res, next) {
    try {
      const { id } = req.params;
      const product = await ProductService.getOne(id);
      return res.json(product);
    } catch (e) {
      next(e)
    }
  }

  async edit(req, res, next) {
    try {
      const { id } = req.params;
      const { name, price, typeId, brandId, info } = req.body;

      const { img } = req.files;
      let fileName = uuid.v4() + ".jpg";
      img.mv(path.resolve(__dirname, "..", "static", fileName));

      const product = await ProductService.edit(
        id,
        name,
        price,
        typeId,
        brandId,
        info,
        fileName
      );

      return res.json(product);
    } catch (e) {
      next(e);
    }
  }
  
  async delete(req, res, next) {
    try {
      const { id } = req.params;
      await ProductService.delete(id);
      return res.json({ message: "Товар успешно удален" });
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new ProductController();
