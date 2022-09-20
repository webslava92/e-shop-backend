const uuid = require("uuid");
const path = require("path");
const ApiError = require("../exceptions/ApiError");
const UserService = require("../service/userService");
const { validationResult } = require("express-validator");

class UserController {
  async registration(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(ApiError.BadRequest("Ошибка валидации", errors.array()));
      }
      const { email, phone, password, role } = req.body;
      const img = req?.files?.img;

      const userData = await UserService.registration(
        email,
        phone,
        password,
        img,
        role
      );

      res.cookie("refreshToken", userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });

      return res.json(userData);
    } catch (e) {
      next(e);
    }
  }

  async activate(req, res, next) {
    try {
      const activationLink = req.params.link;
      await UserService.activate(activationLink);

      return res.redirect(process.env.CLIENT_URL);
    } catch (error) {
      next(e);
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const userData = await UserService.login(email, password);

      res.cookie("refreshToken", userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });

      return res.json({ userData });
    } catch (e) {
      next(e);
    }
  }

  async logout(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      const token = await UserService.logout(refreshToken);
      res.clearCookie("refreshToken");

      return res.json(token);
    } catch (e) {
      next(e);
    }
  }

  async refresh(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      const userData = await UserService.refresh(refreshToken);
      res.cookie("refreshToken", userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });

      return res.json(userData);
    } catch (e) {
      next(e);
    }
  }

  async getAll(req, res, next) {
    try {
      const users = await UserService.getAll();
      return res.json(users);
    } catch (e) {
      next(e);
    }
  }

  async getOne(req, res, next) {
    try {
      const { id } = req.params;
      const user = await UserService.getOne(id);

      return res.json(user);
    } catch (e) {
      next(e);
    }
  }

  async edit(req, res, next) {
    try {
      const { id } = req.params;
      const { email, phone, password, role } = req.body;
      const img = req?.files?.img;

      const user = await UserService.edit(id, email, phone, password, img, role);

      return res.json(user);
    } catch (e) {
      next(e);
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.params;
      const deleteUser = await UserService.delete(id);
      
      return res.json({ message: "Пользователь успешно удален" });
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new UserController();
