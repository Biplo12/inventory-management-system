import { NextFunction, Request, Response } from "express";
import prisma from "@/db";

export const createOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { customerId, products } = req.body;

    for (const { productId, quantity } of products) {
      console.log(productId, quantity);

      const product = await prisma.product.findUnique({
        where: { id: productId },
      });

      if (!product) {
        res.status(404).send({
          status: "failed",
          message: `Product with ID ${productId} not found`,
          data: null,
        });

        return;
      }

      if (product.stock < quantity) {
        res.status(400).send({
          status: "failed",
          message: `Insufficient stock for product ID ${productId}`,
          data: null,
        });
        return;
      }
    }

    const order = await prisma.order.create({
      data: {
        customerId,
        orderItems: {
          create: products.map(({ productId, quantity }) => ({
            productId,
            quantity,
          })),
        },
      },
      include: {
        orderItems: true,
      },
    });

    console.log(order);

    for (const { productId, quantity } of products) {
      await prisma.product.update({
        where: { id: productId },
        data: { stock: { decrement: quantity } },
      });
    }

    res.status(201).send({
      status: "success",
      message: "Order created successfully",
      data: order,
    });
  } catch (error) {
    next(error);
  }
};
