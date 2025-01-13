import { NextFunction, Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { generateTimestamps } from "@/utils";
import { validateProduct } from "@/validations/products";
import { Product } from "@prisma/client";
import prisma from "@/db";
import {
  createProductSchema,
  idSchema,
  stockSchema,
  updateProductSchema,
  quantitySchema,
} from "@/validations/products/schema";

export const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const product = req.body;

    const productValidationError = validateProduct(
      product,
      createProductSchema
    );

    if (productValidationError) {
      res.status(400).send({ message: productValidationError.message });
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

    const isProductNameExists = await prisma.product.findFirst({
      where: {
        name: product.name,
      },
    });

    if (isProductNameExists) {
      res.status(400).send({ message: "Product name already exists" });
      return;
    }

    await prisma.product.create({
      data: newProduct,
    });

    res
      .status(201)
      .send({ id: newProduct.id, message: "Product created successfully" });
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (
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

    const isProductExists = await prisma.product.findFirst({
      where: {
        id,
      },
    });

    if (!isProductExists) {
      res.status(404).send({ message: "Product not found" });
      return;
    }

    await prisma.product.delete({
      where: {
        id,
      },
    });

    res.status(204).send({ message: "Product deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (
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

    const product = req.body;

    const productValidationError = validateProduct(
      product,
      updateProductSchema
    );

    if (productValidationError) {
      res.status(400).send({ message: productValidationError.message });
      return;
    }

    const isProductExists = await prisma.product.findFirst({
      where: {
        id,
      },
    });

    if (!isProductExists) {
      res.status(404).send({ message: "Product not found" });
      return;
    }

    if (product?.name) {
      const isProductNameExists = await prisma.product.findFirst({
        where: {
          name: product.name,
        },
      });

      if (isProductNameExists) {
        res.status(400).send({ message: "Product name already exists" });
        return;
      }
    }

    const isUpdatedValuesSame = Object.keys(product).every(
      (key) => isProductExists[key] === product[key]
    );

    if (isUpdatedValuesSame) {
      res.status(400).send({ message: "No changes to update" });
      return;
    }

    await prisma.product.update({
      where: {
        id,
      },
      data: {
        ...product,
        updatedAt: new Date(),
      },
    });

    res.status(200).send({ message: "Product updated successfully" });
  } catch (error) {
    next(error);
  }
};

export const restockProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { stock } = req.body;

    const idValidationError = validateProduct(id, idSchema);

    if (idValidationError) {
      res.status(400).send({ message: idValidationError.message });
      return;
    }

    const stockValidationError = validateProduct(stock, stockSchema);

    if (stockValidationError) {
      res.status(400).send({ message: stockValidationError.message });
      return;
    }

    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      res.status(404).send({ message: "Product not found" });
      return;
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        stock: product.stock + stock,
        updatedAt: new Date(),
      },
    });

    res.status(200).send({
      message: "Product restocked successfully",
      stock: updatedProduct.stock,
    });
  } catch (error) {
    next(error);
  }
};

export const sellProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    const idValidationError = validateProduct(id, idSchema);
    if (idValidationError) {
      res.status(400).send({ message: idValidationError.message });
      return;
    }

    const quantityValidationError = validateProduct(quantity, quantitySchema);
    if (quantityValidationError) {
      res.status(400).send({ message: quantityValidationError.message });
      return;
    }

    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      res.status(404).send({ message: "Product not found" });
      return;
    }

    if (product.stock < quantity) {
      res.status(400).send({ message: "Insufficient stock" });
      return;
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        stock: product.stock - quantity,
        updatedAt: new Date(),
      },
    });

    res.status(200).send({
      message: "Product sold successfully",
      stock: updatedProduct.stock,
    });
  } catch (error) {
    next(error);
  }
};
