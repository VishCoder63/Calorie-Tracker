import * as joi from 'joi';
export const createFoodSchema = joi.object({
  name: joi.string().min(3).required(),
  date: joi.date().min(Date.now()).required(),
  month: joi.number().min(1).max(12).required(),
  calorie: joi.number().min(0.1).required(),
  price: joi.number().min(0.01).required(),
  userId: joi.number().required(),
});

export const updateFoodSchema = joi.object({
  name: joi.string().min(3),
  date: joi.date().min(Date.now()),
  month: joi.number().min(1).max(12),
  calorie: joi.number().min(0.1),
  price: joi.number().min(0.01),
});

export const getFoodSchema = joi.object({
  page: joi.number().min(1).default(1),
  startDate: joi.date(),
  endDate: joi.date().when('startDate', {
    is: true,
    then: joi.required(),
    otherwise: joi.optional(),
  }),
});
