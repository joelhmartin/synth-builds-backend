const mongoose = require("mongoose");
const Joi = require("joi");

const patchSchema = new mongoose.Schema({
  file: String,
  song: String,
  synth: String,
  genre: String,
  producer: String,
  description: String,
});

const Patch = mongoose.model("Patch", patchSchema);

function validatePatch(patch) {
  const schema = Joi.object({
    file: Joi.string(),
    song: Joi.string(),
    synth: Joi.string(),
    genre: Joi.string(),
    producer: Joi.string(),
    description: Joi.string(),
  });
  return schema.validate(patch);
}

exports.Patch = Patch;
exports.validatePatch = validatePatch;
