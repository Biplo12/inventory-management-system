import prisma from "@/db";
import { NextFunction, Request, Response } from "express";

export const getProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const products = await prisma.product.findMany();

    res.status(200).send({
      status: "success",
      message: "Products fetched successfully",
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

export const getProductById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const product = await prisma.product.findUnique({ where: { id } });

    if (!product) {
      res.status(404).send({
        status: "failed",
        message: "Product not found",
        data: null,
      });
      return;
    }

    res.status(200).send({
      status: "success",
      message: "Product fetched successfully",
      data: product,
    });
  } catch (error) {
    next(error);
  }
};
