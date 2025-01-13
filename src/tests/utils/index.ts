import prisma from "@/db";
import { IS_TEST } from "@/constants/env";

export const findAndDeleteAllProducts = async () => {
  if (IS_TEST) {
    await prisma.product.deleteMany();
  } else {
    throw new Error("❌ Cannot delete products in non-test environment");
  }
};
