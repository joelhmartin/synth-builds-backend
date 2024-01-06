const _ = require("lodash");
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { User } = require("../models/user");
const bcrypt = require("bcrypt");

router.get("/", async (req, res) => {
  const users = await User.find();
  res.send(users);
});

router.post("/", async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("User already registered");

  user = new User(_.pick(req.body, ["name", "email", "password"]));

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  await user.save();

  _.pick(user, ["_id", "name", "email"]);

  res.send({
    name: user.name,
    email: user.email,
  });
});

router.put("/:id", async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const user = await User.findByIdAndUpdate(
    req.params.id,
    { name: req.body.name },
    {
      new: true,
    }
  );

  if (!user)
    return res.status(404).send("The user with the given ID was not found.");
  res.send(user);
});

router.delete("/:id", (req, res) => {
  if (!user)
    return res.status(404).send("The user with the given ID was not found.");
  const user = User.findByIdAndRemove(req.params.id);
  res.send(user);
});

router.get("/:id", async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user)
    return res.status(404).send("The user with the given ID was not found.");
  res.send(user);
});

function validate(req) {
  const schema = {
    email: Joi.string().min(5).max(50).required().email(),
    password: Joi.string().min(5).max(255).required(),
  };

  return Joi.validate(req, schema);
}


module.exports = router;
