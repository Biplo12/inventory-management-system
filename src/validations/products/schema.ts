import joi from "joi";

export const createProductSchema = joi.object({
  name: joi.string().required().max(50),
  description: joi.string().required().max(50),
  price: joi.number().required().min(0),
  stock: joi.number().integer().required().min(0),
});
