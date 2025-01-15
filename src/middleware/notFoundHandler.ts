import { Request, Response, NextFunction } from "express";

const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  res.status(404).json({
    status: "failed",
    message: "Endpoint not found",
    data: null,
  });
};

export default notFoundHandler;
