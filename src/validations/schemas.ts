import Joi from "joi";
import { isValidObjectId } from "mongoose";

const checkIsValidObjectId = (value: string, helper: Joi.CustomHelpers) => {
  if (!isValidObjectId(value)) {
    return helper.error("string.objectId");
  }

  return value;
};

const createProductSchema = Joi.object({
  name: Joi.string().required().max(50).strict(),
  description: Joi.string().required().max(50).strict(),
  price: Joi.number().required().min(0).strict(),
  stock: Joi.number().integer().required().min(0).strict(),
});

const updateProductSchema = Joi.object({
  name: Joi.string().max(50).optional().strict(),
  description: Joi.string().max(50).optional().strict(),
  price: Joi.number().min(0).optional().strict(),
  stock: Joi.number().integer().min(0).optional().strict(),
});

const idSchema = Joi.object({
  id: Joi.string().custom(checkIsValidObjectId).required().strict().messages({
    "string.objectId": "Invalid id",
    "any.required": "Id is required",
    "string.base": "Id must be a string",
    "string.empty": "Id is required",
  }),
});

const restockProductSchema = Joi.object({
  stock: Joi.number()
    .integer()
    .required()
    .min(0)
    .messages({
      "number.min": "Stock must be greater than or equal to 0",
      "number.base": "Stock must be a number",
      "number.integer": "Stock must be an integer",
      "any.required": "Stock is required",
    })
    .strict(),
});

const sellProductSchema = Joi.object({
  quantity: Joi.number()
    .integer()
    .required()
    .min(0)
    .messages({
      "number.min": "Quantity must be greater than or equal to 0",
      "number.base": "Quantity must be a number",
      "number.integer": "Quantity must be an integer",
      "any.required": "Quantity is required",
    })
    .strict(),
});

const orderSchema = Joi.object({
  customerId: Joi.string()
    .custom(checkIsValidObjectId)
    .required()
    .strict()
    .messages({
      "string.objectId": "Invalid id",
      "any.required": "Customer id is required",
      "string.base": "Id must be a string",
      "string.empty": "Customer id is required",
    }),
  products: Joi.array()
    .items(
      Joi.object({
        productId: Joi.string()
          .custom(checkIsValidObjectId)
          .required()
          .strict()
          .messages({
            "string.objectId": "Invalid id",
            "any.required": "Product id is required",
            "string.base": "Id must be a string",
            "string.empty": "Product id is required",
          }),
        quantity: Joi.number().integer().min(1).required().strict().messages({
          "number.base": "Quantity must be a number",
          "number.integer": "Quantity must be an integer",
          "number.min": "Quantity must be greater than or equal to 1",
          "any.required": "Quantity is required",
        }),
      })
    )
    .min(1)
    .required()
    .messages({
      "array.base": "Products must be an array",
      "array.empty": "Products must not be empty",
    }),
});

export default {
  "/products": {
    get: {
      params: null,
      body: null,
    },
    post: {
      params: null,
      body: createProductSchema,
    },
  },
  "/products/:id": {
    get: {
      params: idSchema,
      body: null,
    },
    delete: {
      params: idSchema,
      body: null,
    },
    put: {
      params: idSchema,
      body: updateProductSchema,
    },
  },

  "/products/:id/restock": {
    post: {
      params: idSchema,
      body: restockProductSchema,
    },
  },
  "/products/:id/sell": {
    post: {
      params: idSchema,
      body: sellProductSchema,
    },
  },
  "/orders": {
    post: {
      params: null,
      body: orderSchema,
    },
  },
};
