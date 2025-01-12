import { createProductSchema } from "./schema";
import { Product } from "@prisma/client";
import Joi from "joi";

export const validateProduct = (
  product: Product
): Joi.ValidationError | undefined => {
  const { error } = createProductSchema.validate(product);

  if (error) {
    return error;
  }
};
