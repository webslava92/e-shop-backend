const { BrandModel } = require("../models/models");
const ApiError = require("../exceptions/ApiError");

class BrandService {
  async create(name, description, fileName) {
    let brand = await BrandModel.findOne({ where: { name }});
    if (brand) {
      throw ApiError.BadRequest(`Бренд: ${name}, уже существует. Укажите другое наименование`);
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

  async edit(id, name, description, fileName) {
    const brand = await BrandModel.findOne({ where: { id } });
    if (!brand) {
      throw ApiError.BadRequest(`Бренд с id: ${id}, не найден`);
    }

    if (name) brand.name = name;
    if (description) brand.description = description;
    if (fileName) brand.img = fileName;

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
