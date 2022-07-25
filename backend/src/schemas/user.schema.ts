import * as joi from 'joi';
export const signInSchema = joi.object({
  email: joi.string().email().required(),
  password: joi.string().min(4).required(),
});

export const inviteFriendSchema = joi.object({
  name: joi.string().min(3).required(),
  email: joi.string().email().required(),
});
