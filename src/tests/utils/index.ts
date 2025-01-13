import prisma from "@/db";

export const findAndDeleteTestProducts = async () => {
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
