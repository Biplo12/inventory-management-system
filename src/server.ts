import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";

dotenv.config();

const PORT = process.env.PORT || 5000;

const app = express();

app.use(bodyParser.json());

app.listen(PORT, () => {
  console.log(`[server]: Server is running on port ${PORT}`);
});
