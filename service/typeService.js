const uuid = require("uuid");
const path = require("path");
const fs = require("fs");
const { TypeModel } = require("../models/models");
const ApiError = require("../exceptions/ApiError");

class TypeService {
  async create(name, description, img) {
    let type = await TypeModel.findOne({ where: { name } });
    if (type) {
      throw ApiError.BadRequest(
        `Раздел: ${name}, уже существует. Укажите другое наименование`
      );
    }

    let fileName;
    if (img) {
      fileName = uuid.v4() + ".jpg";
      img.mv(path.resolve(__dirname, "..", "static", fileName));
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

  async edit(id, name, description, img) {
    const type = await TypeModel.findOne({ where: { id } });
    if (!type) {
      throw ApiError.BadRequest(`Раздел с id: ${id}, не найден`);
    }

    let fileName;
    if (img) {
      fileName = uuid.v4() + ".jpg";
      img.mv(path.resolve(__dirname, "..", "static", fileName));

      if (type.img) {
        fs.unlink(path.join(__dirname, "..", "static", type.img), (err) => {
          if (err)
            throw ApiError.BadRequest(
              `Удаление файла ${type.img} не выполнено`
            );
          else {
            console.log(`${type.img} deleted successfully`);
          }
          type.save().then(() => type);
        });
      }
      type.img = fileName;
    }

    if (name) type.name = name;
    if (description) type.description = description;

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
