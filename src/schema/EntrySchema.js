import Joi from "joi";

export const entriesSchema = Joi.object({
    amount: Joi.number().min(1).required(),
    description: Joi.string().min(1).required(),
    isTrue: Joi.boolean().required(),
});