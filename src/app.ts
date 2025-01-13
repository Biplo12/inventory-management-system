import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import productsRouter from "@/routes/products";
import errorHandler from "./middleware/errorHandler";

dotenv.config();

const PREFIX = "/api";

export const app = express();

app.use(bodyParser.json());

app.use(`${PREFIX}/products`, productsRouter);

app.use(errorHandler);

export default app;
