import prisma from "@/db";
import { IS_TEST } from "@/constants/env";

export const findAndDeleteAllProducts = async () => {
  if (!IS_TEST) {
    throw new Error("❌ Cannot delete products in non-test environment");
  }

  const productsWithTestName = await prisma.product.findMany({
    where: { name: "Test Product" },
  });

  const productsWithUpdatedName = await prisma.product.findMany({
    where: { name: "Updated Product" },
  });

  if (productsWithTestName.length > 0) {
    await prisma.product.deleteMany({ where: { name: "Test Product" } });
  }

  if (productsWithUpdatedName.length > 0) {
    await prisma.product.deleteMany({
      where: { name: "Updated Product" },
    });
  }
};
