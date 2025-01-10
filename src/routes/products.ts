import { Router } from "express";
import { createProduct } from "src/commands/products";

const router = Router();

router.post("/", createProduct);

export default router;
