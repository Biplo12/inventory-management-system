import Joi from "joi";

export const validateProduct = (
  validationData: any,
  schema: Joi.Schema
): Joi.ValidationError | undefined => {
  const { error } = schema.validate(validationData);
  const formattedMessage = error?.message
    .replace(/"/g, "")
    .replace(/\b\w/, (char) => char.toUpperCase());

  if (error) {
    return {
      ...error,
      message: formattedMessage,
    };
  }

  return undefined;
};
