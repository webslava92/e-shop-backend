const TypeService = require("../service/typeService");

class TypeController {
  async create(req, res, next) {
    try {
      const { name, description } = req.body;
      const img = req?.files?.img;

      const type = await TypeService.create(name, description, img);

      return res.json(type);
    } catch (e) {
      next(e);
    }
  }

  async getAll(req, res) {
    const types = await TypeService.getAll();
    return res.json(types);
  }

  async getOne(req, res, next) {
    try {
      const { id } = req.params;
      const type = await TypeService.getOne(id);
      return res.json(type);
    } catch (e) {
      next(e);
    }
  }
  
  async edit(req, res, next) {
    try {
      const { id } = req.params;
      const { name, description } = req.body;
      const img = req?.files?.img;

      const type = await TypeService.edit(id, name, description, img);

      return res.json(type);
    } catch (e) {
      next(e);
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.params;
      const type = await TypeService.delete(id);

      return res.json({ message: "Раздел успешно удален" });
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new TypeController();
