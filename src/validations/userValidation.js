const Joi = require("joi");

const registerSchema = Joi.object({
  username: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(1).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(1).required(),
});


const updatePasswordSchema = Joi.object({
  email: Joi.string().email().required(),
  currentPassword: Joi.string().min(1).required(),
  newPassword: Joi.string().min(1).required(),
  confirmPassword: Joi.any().valid(Joi.ref("newPassword")).required(),
});


module.exports = { registerSchema, loginSchema,updatePasswordSchema };