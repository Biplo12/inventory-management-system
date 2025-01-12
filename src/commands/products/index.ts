import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { generateTimestamps } from "@/utils";
import { validateProduct } from "@/validations/products";
import { Product } from "@prisma/client";
import prisma from "@/db";

export const createProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const product = req.body;

    const error = validateProduct(product);

    if (error) {
      res.status(400).send({ message: error.message });
      return;
    }

    const newProduct: Product = {
      id: uuidv4(),
      ...product,
      ...generateTimestamps(),
    };

    const isProductExists = await prisma.product.findFirst({
      where: {
        name: product.name,
      },
    });

    if (isProductExists) {
      res.status(400).send({ message: "Product already exists" });
      return;
    }

    await prisma.product.create({
      data: newProduct,
    });

    res
      .status(201)
      .send({ id: newProduct.id, message: "Product created successfully" });
  } catch (error) {
    res
      .status(500)
      .send({ message: error.message || "Failed to create product" });
    return;
  }
};
