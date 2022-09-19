const { TypeModel } = require("../models/models");
const ApiError = require("../exceptions/ApiError");

class TypeService {
  async create(name, description, fileName) {
    let type = await TypeModel.findOne({ where: { name }});
    if (type) {
      throw ApiError.BadRequest(`Раздел: ${name}, уже существует. Укажите другое наименование`);
    }
    type = await TypeModel.create({
      name,
      description,
      img: fileName,
    });

    return type;
  }

  async getAll() {
    const types = await TypeModel.findAll();
    return types;
  }

  async getOne(id) {
    const type = await TypeModel.findOne({
      where: { id },
    });
    return type;
  }

  async edit(id, name, description, fileName) {
    const type = await TypeModel.findOne({ where: { id } });
    if (!type) {
      throw ApiError.BadRequest(`Раздел с id: ${id}, не найден`);
    }

    if (name) type.name = name;
    if (description) type.description = description;
    if (fileName) type.img = fileName;

    const updatedType = await type.save().then(() => type);

    return updatedType;
  }

  async delete(id) {
    const type = await TypeModel.findOne({
      where: { id },
    });
    if (!type) {
      throw ApiError.BadRequest(`Раздел с id: ${id}, не найден`);
    }
    await TypeModel.destroy({
      where: { id },
    });
  }
}

module.exports = new TypeService();
