import { NextFunction, Request, Response } from "express";
import { generateTimestamps } from "@/utils";
import { Product } from "@prisma/client";
import prisma from "@/db";

export const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const product = req.body;

    const isProductNameExists = await prisma.product.findFirst({
      where: {
        name: product.name,
      },
    });

    if (isProductNameExists) {
      res.status(400).send({
        status: "failed",
        message: "Product already exists",
        data: null,
      });
      return;
    }

    const newProduct: Product = {
      ...product,
      ...generateTimestamps(),
    };

    const createdProduct = await prisma.product.create({
      data: newProduct,
    });

    res.status(201).send({
      status: "success",
      message: "Product created successfully",
      data: createdProduct,
    });
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

    const isProductExists = await prisma.product.findFirst({
      where: {
        id,
      },
    });

    if (!isProductExists) {
      res.status(404).send({
        status: "failed",
        message: "Product not found",
        data: null,
      });

      return;
    }

    await prisma.product.delete({
      where: {
        id,
      },
    });

    res.status(200).send({
      status: "success",
      message: "Product deleted successfully",
      data: null,
    });
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
    const product = req.body;

    const isProductExists = await prisma.product.findFirst({
      where: {
        id,
      },
    });

    if (!isProductExists) {
      res.status(404).send({
        status: "failed",
        message: "Product not found",
        data: null,
      });
      return;
    }

    if (product?.name) {
      const isProductNameExists = await prisma.product.findFirst({
        where: {
          name: product.name,
        },
      });

      if (isProductNameExists) {
        res.status(400).send({
          status: "failed",
          message: "Product name already exists",
          data: null,
        });
        return;
      }
    }

    const isUpdatedValuesSame = Object.keys(product).every(
      (key) => isProductExists[key] === product[key]
    );

    if (isUpdatedValuesSame) {
      res.status(400).send({
        status: "failed",
        message: "No changes to update",
        data: null,
      });

      return;
    }

    const updatedProduct = await prisma.product.update({
      where: {
        id,
      },
      data: {
        ...product,
        updatedAt: new Date(),
      },
    });

    res.status(200).send({
      status: "success",
      message: "Product updated successfully",
      data: updatedProduct,
    });
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

    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      res.status(404).send({
        status: "failed",
        message: "Product not found",
        data: null,
      });
      return;
    }

    const restockedProduct = await prisma.product.update({
      where: { id },
      data: {
        stock: product.stock + stock,
        updatedAt: new Date(),
      },
    });

    res.status(200).send({
      status: "success",
      message: "Product restocked successfully",
      data: restockedProduct,
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

    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      res.status(404).send({
        status: "failed",
        message: "Product not found",
        data: null,
      });
      return;
    }

    if (product.stock < quantity) {
      res.status(400).send({
        status: "failed",
        message: "Insufficient stock",
        data: null,
      });
      return;
    }

    const soldProduct = await prisma.product.update({
      where: { id },
      data: {
        stock: product.stock - quantity,
        updatedAt: new Date(),
      },
    });

    res.status(200).send({
      status: "success",
      message: "Product sold successfully",
      data: soldProduct,
    });
  } catch (error) {
    next(error);
  }
};
