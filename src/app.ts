import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import productsRouter from "@/routes/products";

dotenv.config();

const PREFIX = "/api";

export const app = express();

app.use(bodyParser.json());

app.use(`${PREFIX}/products`, productsRouter);
