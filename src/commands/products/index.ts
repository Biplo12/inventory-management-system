import db from "src/db";
import { Request, Response } from "express";
import { Product } from "src/interfaces/Database";
import { v4 as uuidv4 } from "uuid";
import { generateTimestamps } from "@/utils";
import { validateProduct } from "@/validations/products";

export const createProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    await db.read();

    const product = req.body;

    const error = validateProduct(product);

    if (error) {
      res.status(400).send({ message: error.message });
      return;
    }

    const newProduct: Product = {
      id: uuidv4(),
      ...product,
      ...generateTimestamps(),
    };

    const isProductExists = db.data.products.find(
      (p) => p.name === product.name
    );

    if (isProductExists) {
      res.status(400).send({ message: "Product already exists" });
      return;
    }

    db.data.products.push(newProduct);

    await db.write();

    res
      .status(201)
      .send({ id: newProduct.id, message: "Product created successfully" });
  } catch (error) {
    res.status(500).send({ message: "Failed to create product" });
    return;
  }
};
