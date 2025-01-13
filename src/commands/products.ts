import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { generateTimestamps } from "@/utils";
import { validateProduct } from "@/validations/products";
import { Product } from "@prisma/client";
import prisma from "@/db";
import {
  createProductSchema,
  idSchema,
  updateProductSchema,
} from "@/validations/products/schema";

export const createProduct = async (
  req: Request,
  res: Response
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

    if (!id) {
      res.status(400).send({ message: "Invalid product id" });
      return;
    }

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

    res.status(200).send({ message: "Product deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .send({ message: error.message || "Failed to delete product" });
    return;
  }
};

export const updateProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
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
    res
      .status(500)
      .send({ message: error.message || "Failed to update product" });
    return;
  }
};
