const BrandService = require("../service/brandService");

class BrandController {
  async create(req, res, next) {
    try {
      const { name, description } = req.body;
      const img = req?.files?.img;
      

      const brand = await BrandService.create(name, description, img);

      return res.json(brand);
    } catch (e) {
      next(e);
    }
  }

  async getAll(req, res) {
    const brands = await BrandService.getAll();
    return res.json(brands);
  }

  async getOne(req, res, next) {
    try {
      const { id } = req.params;
      const brand = await BrandService.getOne(id);
      return res.json(brand);
    } catch (e) {
      next(e);
    }
  }
  
  async edit(req, res, next) {
    try {
      const { id } = req.params;
      const { name, description } = req.body;
      const img = req?.files?.img;

      const brand = await BrandService.edit(id, name, description, img);

      return res.json(brand);
    } catch (e) {
      next(e);
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.params;
      const brand = await BrandService.delete(id);

      return res.json({ message: "Бренд успешно удален" });
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new BrandController();
