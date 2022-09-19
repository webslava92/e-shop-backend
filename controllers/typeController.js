const uuid = require("uuid");
const path = require("path");
const TypeService = require("../service/typeService");

class TypeController {
  async create(req, res, next) {
    try {
      const { name, description } = req.body;
      const { img } = req.files;
      let fileName;
      if (img) {
        fileName = uuid.v4() + ".jpg";
        img.mv(path.resolve(__dirname, "..", "static", fileName));
      }

      const type = await TypeService.create(name, description, fileName);

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

      const { img } = req.files;
      let fileName; 
      if (img) {
        fileName = uuid.v4() + ".jpg";
        img.mv(path.resolve(__dirname, "..", "static", fileName));
      }

      const type = await TypeService.edit(id, name, description, fileName);

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
