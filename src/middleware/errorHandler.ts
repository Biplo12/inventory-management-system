import { Request, Response, NextFunction } from "express";

interface CustomError extends Error {
  statusCode?: number;
  customMessage?: string;
}

const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error(`Error: ${err.message}`);
  console.error(`Stack: ${err.stack}`);

  const statusCode = err.statusCode || 500;
  const message = err.customMessage || "An unexpected error occurred";

  res.status(statusCode).send({
    status: "failed",
    message,
    data: null,
  });
};

export default errorHandler;
