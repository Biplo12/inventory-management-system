import { Router } from "express";
import {
  createProduct,
  deleteProduct,
  updateProduct,
} from "@/commands/products";
import { getProducts, getProductById } from "@/queries/products";

const router = Router();

router.post("/", createProduct);
router.get("/", getProducts);
router.get("/:id", getProductById);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

export default router;
