import { Router } from "express";
import { createOrder } from "@/commands/orders";

const router = Router();

router.post("/", createOrder);

export default router;
