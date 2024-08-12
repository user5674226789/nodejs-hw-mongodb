import Joi, { string } from "joi";

export const createContactSchema = Joi.object ({
    name: Joi.string().min(3).max(20).required().messages({
        'string.base': 'Username should be a string',
        'string.min': 'Username should have at least {#limit} characters',
        'string.max': 'Username should have at most {#limit} characters',
        'any.required': 'Username is required',
    }),
    phoneNumber: Joi.string().min(3).max(20).required().messages({
        'string.base': 'PhoneNumber should be a string',
        'string.min': 'PhoneNumber should have at least {#limit} characters',
        'string.max': 'PhoneNumbere should have at most {#limit} characters',
        'any.required': 'PhoneNumber is required',
    }),
    email: Joi.string().email(),
    contactType: Joi.string().valid('work', 'home', 'personal').required(),
    isFavourite: Joi.boolean(),
  });
  
  export const updateContactSchema = Joi.object({
    name: Joi.string().min(3).max(20),
    phoneNumber: Joi.string().min(3).max(20),
    email: Joi.string().email(),
    contactType: Joi.string().valid('work', 'home', 'personal'),
    isFavourite: Joi.boolean(),
  });