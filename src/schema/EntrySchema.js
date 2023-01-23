import Joi from "joi";

export const entriesSchema = Joi.object({
    value: Joi.number().min(1).required(),
    description: Joi.string().min(1).required(),
    type: Joi.boolean().required(),
});