import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import productsRouter from "@/routes/products";

dotenv.config();

const PORT = process.env.PORT || 5000;
const PREFIX = "/api";

export const app = express();

app.use(bodyParser.json());

app.use(`${PREFIX}/products`, productsRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
