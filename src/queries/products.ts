import prisma from "@/db";
import { validateProduct } from "@/validations/products";
import { idSchema } from "@/validations/products/schema";
import { NextFunction, Request, Response } from "express";

export const getProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const products = await prisma.product.findMany();

    res.status(200).send(products);
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

    const idValidationError = validateProduct(id, idSchema);

    if (idValidationError) {
      res.status(400).send({ message: idValidationError.message });
      return;
    }

    const product = await prisma.product.findUnique({ where: { id } });

    if (!product) {
      res.status(404).send({ message: "Product not found" });
      return;
    }

    res.status(200).send(product);
  } catch (error) {
    next(error);
  }
};
