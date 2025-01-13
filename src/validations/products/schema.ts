import joi from "joi";

export const createProductSchema = joi.object({
  name: joi.string().required().max(50).strict(),
  description: joi.string().required().max(50).strict(),
  price: joi.number().required().min(0).strict(),
  stock: joi.number().integer().required().min(0).strict(),
});

export const idSchema = joi.string().required().strict();
export const stockSchema = joi
  .number()
  .integer()
  .required()
  .min(0)
  .messages({
    "number.min": "Stock must be greater than or equal to 0",
    "number.base": "Stock must be a number",
    "number.integer": "Stock must be an integer",
    "any.required": "Stock is required",
  })
  .strict();

export const updateProductSchema = joi.object({
  name: joi.string().max(50).strict(),
  description: joi.string().max(50).strict(),
  price: joi.number().min(0).strict(),
  stock: joi.number().integer().min(0).strict(),
});
