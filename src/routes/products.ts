import { Router } from "express";
import { createProduct, deleteProduct } from "@/commands/products";

const router = Router();

router.post("/", createProduct);
router.delete("/", deleteProduct);

export default router;
