import db from "src/db";
import { Request, Response } from "express";
import { Product } from "src/interfaces/Database";
import { v4 as uuidv4 } from "uuid";

export const createProduct = async (
  res: Response,
  req: Request
): Promise<Product> => {
  try {
    await db.read();

    const product = req.body;

    const newProduct: Product = {
      id: uuidv4(),
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      createdAt: new Date(),
      updatedAt: new Date(),
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

    return newProduct;
  } catch (error) {
    res.status(500).send({ message: "Failed to create product" });
    return;
  }
};
