import { Router } from "express";
import { createOrder } from "@/commands/orders";
import schemaValidator from "@/middleware/schemaValidator";

const router = Router();

router.post("/", schemaValidator("/orders"), createOrder);

export default router;
