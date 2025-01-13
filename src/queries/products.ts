import prisma from "@/db";
import { validateProduct } from "@/validations/products";
import { idSchema, nameSchema } from "@/validations/products/schema";
import { Request, Response } from "express";

export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany();

    res.status(200).send(products);
  } catch (error) {
    res
      .status(500)
      .send({ message: error.message || "Failed to get products" });
    return;
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).send({ message: "Invalid product id" });
      return;
    }

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
    res.status(500).send({ message: error.message || "Failed to get product" });
    return;
  }
};
