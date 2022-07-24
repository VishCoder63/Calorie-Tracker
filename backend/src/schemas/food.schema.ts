import * as joi from 'joi';
export const createFoodSchema = joi.object({
  name: joi.string().min(3).required(),
  datetime: joi.date().min(Date.now()).required(),
  calorie: joi.number().min(0.1).required(),
  price: joi.number().min(0.01).required(),
});

export const updateFoodSchema = joi.object({
  name: joi.string().min(3),
  datetime: joi.date(),
  calorie: joi.number().min(0.1),
  price: joi.number().min(0.01),
});

export const getFoodSchema = joi.object({
  page: joi.number().min(1).default(1),
  startDate: joi.date(),
  endDate: joi.date().optional(),
});
