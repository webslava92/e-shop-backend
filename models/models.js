const sequelize = require('../db')
const {DataTypes} = require('sequelize')

const UserModel = sequelize.define("user", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  phone: { type: DataTypes.STRING, unique: true },
  email: { type: DataTypes.STRING, unique: true },
  password: { type: DataTypes.STRING },
  img: { type: DataTypes.STRING, allowNull: true },
  isActivated: { type: DataTypes.BOOLEAN, defaultValue: false },
  activationLink: { type: DataTypes.STRING },
  role: { type: DataTypes.STRING, defaultValue: "USER" },
});

const TokenModel = sequelize.define("token", {
  refreshToken: { type: DataTypes.STRING },
});

const BasketModel = sequelize.define("basket", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
});

const BasketProductModel = sequelize.define("basket_product", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  productId: { type: DataTypes.INTEGER, unique: true, allowNull: false },
  quantity: { type: DataTypes.INTEGER, allowNull: false },
});

const TypeModel = sequelize.define("type", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, unique: true, allowNull: false },
  description: { type: DataTypes.STRING },
  img: { type: DataTypes.STRING },
});

const BrandModel = sequelize.define("brand", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, unique: true, allowNull: false },
  description: { type: DataTypes.STRING },
  img: { type: DataTypes.STRING },
});

const TypeBrandModel = sequelize.define("type_brand", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
})

const ProductModel = sequelize.define("product", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, unique: true, allowNull: false },
  price: { type: DataTypes.INTEGER },
  img: { type: DataTypes.STRING },
});

const RatingModel = sequelize.define("rating", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  rate: { type: DataTypes.STRING, allowNull: false },
});

const ProductInfoModel = sequelize.define("product_info", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.STRING },
});

UserModel.hasOne(TokenModel);
TokenModel.belongsTo(UserModel);

UserModel.hasOne(BasketModel);
BasketModel.belongsTo(UserModel);

UserModel.hasMany(RatingModel);
RatingModel.belongsTo(UserModel);

BasketModel.hasMany(BasketProductModel);
BasketProductModel.belongsTo(BasketModel);

TypeModel.hasMany(ProductModel);
ProductModel.belongsTo(TypeModel);

BrandModel.hasMany(ProductModel);
ProductModel.belongsTo(BrandModel);

ProductModel.hasOne(RatingModel);
RatingModel.belongsTo(ProductModel);

ProductModel.hasMany(ProductInfoModel);
ProductInfoModel.belongsTo(ProductModel);

TypeModel.belongsToMany(BrandModel, {through: TypeBrandModel});
BrandModel.belongsToMany(TypeModel, {through: TypeBrandModel});

module.exports = {
  BasketModel,
  BasketProductModel,
  TokenModel,
  UserModel,
  TypeModel,
  BrandModel,
  RatingModel,
  ProductModel,
  ProductInfoModel,
};
