import { Router } from "express";
import {
  createProduct,
  deleteProduct,
  updateProduct,
  restockProduct,
  sellProduct,
} from "@/commands/products";
import { getProducts, getProductById } from "@/queries/products";
import schemaValidator from "@/middleware/schemaValidator";

const router = Router();

router.post("/", schemaValidator("/products"), createProduct);
router.get("/", schemaValidator("/products"), getProducts);
router.get("/:id", schemaValidator("/products/:id"), getProductById);
router.put("/:id", schemaValidator("/products/:id"), updateProduct);
router.delete("/:id", schemaValidator("/products/:id"), deleteProduct);
router.post(
  "/:id/restock",
  schemaValidator("/products/:id/restock"),
  restockProduct
);
router.post("/:id/sell", schemaValidator("/products/:id/sell"), sellProduct);

export default router;
