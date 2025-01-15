import prisma from "@/db";
import { IS_TEST } from "@/constants/env";

export const findAndDeleteAllTestProducts = async () => {
  if (!IS_TEST) {
    throw new Error("❌ Cannot delete products in non-test environment");
  }

  const productNames = ["Test Product", "Updated Product", "Second Product"];

  for (const name of productNames) {
    const products = await prisma.product.findMany({
      where: { name },
    });

    if (products.length > 0) {
      await prisma.orderItem.deleteMany({
        where: {
          product: {
            name,
          },
        },
      });

      await prisma.product.deleteMany({
        where: { name },
      });
    }
  }
};

export const findAndDeleteAllTestOrders = async () => {
  if (!IS_TEST) {
    throw new Error("❌ Cannot delete orders in non-test environment");
  }

  const ordersWithTestProduct = await prisma.order.findMany({
    where: { orderItems: { some: { product: { name: "Test Product" } } } },
  });

  if (ordersWithTestProduct.length > 0) {
    await prisma.order.deleteMany({
      where: {
        orderItems: {
          some: {
            product: {
              name: "Test Product",
            },
          },
        },
      },
    });
  }
};
