module.exports = class UserDto {
  email;
  phone;
  id;
  isActivated;

  constructor(model) {
    this.email = model.email;
    this.phone = model.phone;
    this.id = model.id;
    this.isActivated = model.isActivated;
  }
};
