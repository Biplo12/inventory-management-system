import { createProductSchema } from "./schema";
import { Product } from "@prisma/client";
import Joi from "joi";

export const validateProduct = (
  product: Product
): Joi.ValidationError | undefined => {
  const { error } = createProductSchema.validate(product);
  const formattedMessage = error?.message
    .replace(/"/g, "")
    .replace(/\b\w/, (char) => char.toUpperCase());

  if (error) {
    return {
      ...error,
      message: formattedMessage,
    };
  }
};
