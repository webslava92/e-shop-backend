const uuid = require("uuid");
const path = require("path");
const fs = require("fs");
const { BrandModel } = require("../models/models");
const ApiError = require("../exceptions/ApiError");

class BrandService {
  async create(name, description, img) {
    let brand = await BrandModel.findOne({ where: { name } });
    if (brand) {
      throw ApiError.BadRequest(
        `Бренд: ${name}, уже существует. Укажите другое наименование`
      );
    }

    let fileName;
    if (img) {
      fileName = uuid.v4() + ".jpg";
      img.mv(path.resolve(__dirname, "..", "static", fileName));
    }

    brand = await BrandModel.create({
      name,
      description,
      img: fileName,
    });

    return brand;
  }

  async getAll() {
    const brands = await BrandModel.findAll();
    return brands;
  }

  async getOne(id) {
    const brand = await BrandModel.findOne({
      where: { id },
    });
    return brand;
  }

  async edit(id, name, description, img) {
    const brand = await BrandModel.findOne({ where: { id } });
    if (!brand) {
      throw ApiError.BadRequest(`Бренд с id: ${id}, не найден`);
    }

    let fileName;
    if (img) {
      fileName = uuid.v4() + ".jpg";
      img.mv(path.resolve(__dirname, "..", "static", fileName));

      if (brand.img) {
        fs.unlink(path.join(__dirname, "..", "static", brand.img), (err) => {
          if (err)
            throw ApiError.BadRequest(
              `Удаление файла ${brand.img} не выполнено`
            );
          else {
            console.log(`${brand.img} deleted successfully`);
          }
          brand.save().then(() => brand);
        });
      }
      brand.img = fileName;
    }

    if (name) brand.name = name;
    if (description) brand.description = description;

    const updatedBrand = await brand.save().then(() => brand);

    return updatedBrand;
  }

  async delete(id) {
    const brand = await BrandModel.findOne({
      where: { id },
    });
    if (!brand) {
      throw ApiError.BadRequest(`Бренд с id: ${id}, не найден`);
    }
    await BrandModel.destroy({
      where: { id },
    });
  }
}

module.exports = new BrandService();
