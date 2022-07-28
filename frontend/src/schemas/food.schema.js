import * as joi from "joi";
export const createFoodSchema = joi.object({
  name: joi.string().min(3).required(),
  datetime: joi.date().max("now").required(),
  calorie: joi.number().min(50).max(2500).required().precision(2),
  price: joi.number().min(50).max(500).required().precision(2),
  email: joi
    .string()
    .email({ tlds: { allow: false } })
    .allow(""),
});

export const updateFoodSchema = joi.object({
  name: joi.string().min(3),
  datetime: joi.date().max("now").required(),
  calorie: joi.number().min(50).max(2500).precision(2),
  price: joi.number().min(50).max(500).precision(2),
});
