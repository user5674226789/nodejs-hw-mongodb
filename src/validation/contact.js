import Joi, { string } from "joi";

export const createContactSchema = Joi.object ({
    name: Joi.string().min(3).max(20).required().messages({
        'string.base': 
    })
})