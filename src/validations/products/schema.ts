import joi from "joi";

export const createProductSchema = joi.object({
  name: joi.string().required().max(50).strict(),
  description: joi.string().required().max(50).strict(),
  price: joi.number().required().min(0).strict(),
  stock: joi.number().integer().required().min(0).strict(),
});

export const deleteProductSchema = joi.string().required().strict();
