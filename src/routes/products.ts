import { Router } from "express";
import {
  createProduct,
  deleteProduct,
  updateProduct,
} from "@/commands/products";
import { getProducts, getProductById } from "@/queries/products";

const router = Router();

router.get("/", getProducts);
router.get("/:id", getProductById);
router.post("/", createProduct);
router.delete("/:id", deleteProduct);
router.put("/:id", updateProduct);

export default router;
