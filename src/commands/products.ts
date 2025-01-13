import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { generateTimestamps } from "@/utils";
import { validateProduct } from "@/validations/products";
import { Product } from "@prisma/client";
import prisma from "@/db";
import {
  createProductSchema,
  deleteProductSchema,
} from "@/validations/products/schema";

export const createProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const product = req.body;

    const error = validateProduct(product, createProductSchema);

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

export const deleteProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const error = validateProduct(id, deleteProductSchema);

    if (error) {
      res.status(400).send({ message: error.message });
      return;
    }

    const isProductExists = await prisma.product.findFirst({
      where: {
        id,
      },
    });

    if (!isProductExists) {
      res.status(400).send({ message: "Product not found" });
      return;
    }

    await prisma.product.delete({
      where: {
        id,
      },
    });

    res.status(200).send({ message: "Product deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .send({ message: error.message || "Failed to delete product" });
    return;
  }
};
