import e, { RequestHandler } from "express";
import schemas from "@/validations/schemas";
import { TStatus, TMethod } from "@/types";
import Joi, { ObjectSchema } from "joi";

interface JoiError {
  status: TStatus;
  message: string;
  data: null;
}

interface CustomError {
  status: string;
  error: string;
  data: null;
}

interface Schema {
  params: ObjectSchema;
  body: ObjectSchema;
}

const supportedMethods: TMethod[] = ["get", "post", "put", "patch", "delete"];

const validationOptions = {
  abortEarly: false,
  allowUnknown: false,
  stripUnknown: false,
};

const schemaValidator = (path: string, useJoiError = true): RequestHandler => {
  return (req, res, next) => {
    const schema = schemas[path][req.method.toLowerCase() as TMethod] as Schema;

    if (!schema) {
      return next();
    }

    const method = req.method.toLowerCase() as TMethod;

    if (!supportedMethods.includes(method)) {
      return next();
    }

    let bodyError = null;
    let bodyValue = null;
    let paramsError = null;
    let paramsValue = null;

    const areParamsSupported = schema?.params;
    const isBodySupported = schema?.body;

    if (areParamsSupported) {
      const { error: paramsValidationError, value: paramsValidatedValue } =
        schema.params.validate(req.params, validationOptions);

      paramsError = paramsValidationError;
      paramsValue = paramsValidatedValue;
    }

    if (isBodySupported) {
      const { error: bodyValidationError, value: bodyValidatedValue } =
        schema.body.validate(req.body, validationOptions);

      bodyError = bodyValidationError;
      bodyValue = bodyValidatedValue;
    }

    const error = bodyError || paramsError;

    if (error) {
      const customError: CustomError = {
        status: "failed",
        error: "Invalid request. Please review request and try again.",
        data: null,
      };

      const formattedMessage = error?.message
        .replace(/"/g, "")
        .replace(/\b\w/, (char: string) => char.toUpperCase());

      const joiError: JoiError = {
        status: "failed",
        message: formattedMessage,
        data: null,
      };

      res.status(422).json(useJoiError ? joiError : customError);
      return;
    }

    req.params = paramsValue;
    req.body = bodyValue;

    next();
  };
};

export default schemaValidator;
