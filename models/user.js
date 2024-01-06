const mongoose = require("mongoose");
const Joi = require("joi");

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
});

const User = mongoose.model("User", userSchema);

function validateUser(user) {
  const schema = Joi.object({
    name: Joi.string(),
    email: Joi.string(),
    password: Joi.string(),
  });

  return schema.validate(user);
}

exports.User = User;
exports.validateUser = validateUser;
