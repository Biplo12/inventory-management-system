import request from "supertest";
import app from "@/app";
import { findAndDeleteAllProducts } from "@/tests/utils";

beforeEach(async () => {
  await findAndDeleteAllProducts();
});

test("Get products successfully", async () => {
  const createdProduct = await request(app).post("/api/products").send({
    name: "Test Product",
    description: "Test Description",
    price: 100,
    stock: 10,
  });

  const response = await request(app).get("/api/products");

  expect(response.status).toBe(200);

  expect(response.body).toContainEqual({
    id: createdProduct.body.id,
    name: "Test Product",
    description: "Test Description",
    price: 100,
    stock: 10,
    createdAt: expect.any(String),
    updatedAt: expect.any(String),
  });
});

test("Get product by id successfully", async () => {
  const createdProduct = await request(app).post("/api/products").send({
    name: "Test Product",
    description: "Test Description",
    price: 100,
    stock: 10,
  });

  const response = await request(app).get(
    `/api/products/${createdProduct.body.id}`
  );

  expect(response.status).toBe(200);
  expect(response.body).toMatchObject({
    id: createdProduct.body.id,
    name: "Test Product",
    description: "Test Description",
    price: 100,
    stock: 10,
  });
});

test("Get product by id with non existing id", async () => {
  const response = await request(app).get("/api/products/1");

  expect(response.status).toBe(404);
  expect(response.body).toEqual({ message: "Product not found" });
});
