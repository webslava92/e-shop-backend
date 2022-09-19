const uuid = require("uuid");
const path = require("path");
const bcrypt = require("bcrypt");
const fs = require("fs");
const { UserModel } = require("../models/models");
const MailService = require("./mailService");
const TokenService = require("./tokenService");
const UserDto = require("../dtos/userDto");
const ApiError = require("../exceptions/ApiError");

class UserService {
  async registration(email, phone, password, img, role) {
    const candidateEmail = await UserModel.findOne({ where: { email } });
    if (candidateEmail) {
      throw ApiError.BadRequest(
        `Пользователь с почтовым адресом ${email}, уже существует`
      );
    }

    const candidatePhone = await UserModel.findOne({ where: { phone } });
    if (candidatePhone) {
      throw ApiError.BadRequest(
        `Пользователь с телефоном ${phone}, уже существует`
      );
    }

    const activationLink = uuid.v4();
    const hashPassword = await bcrypt.hash(password, 3);

    let fileName;
    if (img) {
      fileName = uuid.v4() + ".jpg";
      img.mv(path.resolve(__dirname, "..", "static", fileName));
    }

    const user = await UserModel.create({
      email,
      phone,
      password: hashPassword,
      activationLink,
      img: fileName,
      role,
    });

    await MailService.sendActivationMail(
      email,
      `${process.env.API_URL}/api/user/activate/${activationLink}`
    );

    const userDto = new UserDto(user);
    const tokens = TokenService.generateTokens({ ...userDto });
    await TokenService.saveToken(userDto.id, tokens.refreshToken);

    return { ...tokens, user: userDto };
  }

  async activate(activationLink) {
    const user = await UserModel.findOne({ where: { activationLink } });
    if (!user) {
      throw ApiError.BadRequest("Некорректная ссылка активации");
    }
    user.isActivated = true;
    await user.save();
  }

  async login(email, password) {
    const user = await UserModel.findOne({ where: { email } });
    if (!user) {
      throw ApiError.BadRequest("Пользователь с таким email не найден");
    }

    const isPassEquals = await bcrypt.compare(password, user.password);
    if (!isPassEquals) {
      throw ApiError.BadRequest("Неверный пароль");
    }

    const userDto = new UserDto(user);
    const tokens = TokenService.generateTokens({ ...userDto });
    await TokenService.saveToken(userDto.id, tokens.refreshToken);

    return { ...tokens, user: userDto };
  }

  async logout(refreshToken) {
    const token = await TokenService.removeToken(refreshToken);
    return token;
  }

  async refresh(refreshToken) {
    if (!refreshToken) {
      throw ApiError.UnauthorizedError();
    }
    const userData = TokenService.validateRefreshToken(refreshToken);
    const tokenFromDb = await TokenService.findToken(refreshToken);
    if (!userData || !tokenFromDb) {
      throw ApiError.UnauthorizedError();
    }
    const user = await UserModel.findByPk(userData.id);
    const userDto = new UserDto(user);
    const tokens = TokenService.generateTokens({ ...userDto });
    await TokenService.saveToken(userDto.id, tokens.refreshToken);

    return { ...tokens, user: userDto };
  }

  async getAll() {
    const users = await UserModel.findAll();
    return users;
  }

  async getOne(id) {
    const user = await UserModel.findOne({
      where: { id },
    });
    return user;
  }

  async edit(id, email, phone, password, img, role) {
    const user = await UserModel.findOne({ where: { id } });
    if (!user) {
      throw ApiError.BadRequest(`Пользователь с id: ${id}, не найден`);
    }

    let fileName;
    if (img) {
      fileName = uuid.v4() + ".jpg";
      img.mv(path.resolve(__dirname, "..", "static", fileName));

      if (user.img) {
        fs.unlink(path.join(__dirname, user.img), (err) => {
          if (err)
            throw ApiError.BadRequest(
              `Удаление файла ${user.img} не выполнено`
            );
          else {
            console.log(`./static/${user.img} deleted successfully`);
          }
        });
      }
    }

    if (email) user.email = email;
    if (phone) user.phone = phone;
    const hashPassword = await bcrypt.hash(password, 3);
    if (password) user.password = hashPassword;
    if (fileName) user.fileName = fileName;
    if (role) user.role = role;

    const updateUser = await user.save().then(() => user);
    return updateUser;
  }

  async delete(id) {
    const user = await UserModel.findOne({
      where: { id },
    });
    if (!user) {
      throw ApiError.BadRequest(`Пользователь с id: ${id}, не найден`);
    }
    await UserModel.destroy({
      where: { id },
    });
  }
}

module.exports = new UserService();
