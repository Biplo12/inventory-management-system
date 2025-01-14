import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import productsRouter from "@/routes/products";
import errorHandler from "./middleware/errorHandler";
import ordersRouter from "@/routes/orders";

dotenv.config();

const PREFIX = "/api";

const app = express();

app.use(bodyParser.json());

app.use(`${PREFIX}/products`, productsRouter);

app.use(`${PREFIX}/orders`, ordersRouter);

app.use(errorHandler);

export default app;
