import * as joi from 'joi';
import * as moment from 'moment';

const dateFormatValidator = (value) => {
  // const momentDate = moment(value, 'YYYY-MM-DDTHH:mm:ssZ')
  if (
    moment(value, 'YYYY-MM-DD', true).isValid() ||
    moment(value, 'YYYY-MM-DD HH:mm:ss', true).isValid()
  ) {
    return value;
  } else
    throw new Error(
      'Invalid date format, only YYYY-MM-DD or YYYY-MM-DDHH:mm:ss accepted',
    );
};
export const createFoodSchema = joi.object({
  name: joi.string().min(3).required(),
  datetime: joi.date().max('now').required(),
  calorie: joi.number().min(50).max(2500).required().precision(2),
  price: joi.number().min(50).max(500).required().precision(2),
  email: joi.string().email().optional(),
});

export const updateFoodSchema = joi.object({
  name: joi.string().min(3),
  datetime: joi.date().max('now').required(),
  calorie: joi.number().min(50).max(2500).precision(2),
  price: joi.number().min(50).max(500).precision(2),
});

export const getFoodSchema = joi.object({
  page: joi.number().min(1).default(1),
  startDate: joi.string().custom(dateFormatValidator),
  endDate: joi.string().custom(dateFormatValidator),
});
