import joi from "joi";

export const createProductSchema = joi.object({
  name: joi.string().required(),
  description: joi.string().required(),
  price: joi.number().required(),
  stock: joi.number().required(),
});
