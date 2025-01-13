import request from "supertest";
import app from "@/app";
import { findAndDeleteAllProducts } from "@/tests/utils";

beforeEach(async () => {
  await findAndDeleteAllProducts();
});

test("Sell product successfully", async () => {
  const createdProduct = await request(app).post("/api/products").send({
    name: "Test Product",
    description: "Test Description",
    price: 100,
    stock: 10,
  });

  const response = await request(app)
    .post(`/api/products/${createdProduct.body.id}/sell`)
    .send({ quantity: 5 });

  const soldProduct = await request(app).get(
    `/api/products/${createdProduct.body.id}`
  );

  expect(soldProduct.body.stock).toBe(5);

  expect(response.status).toBe(200);
  expect(response.body).toEqual({
    message: "Product sold successfully",
    stock: 5,
  });
});

test("Sell product with invalid quantity", async () => {
  const createdProduct = await request(app).post("/api/products").send({
    name: "Test Product",
    description: "Test Description",
    price: 100,
    stock: 10,
  });

  const response = await request(app)
    .post(`/api/products/${createdProduct.body.id}/sell`)
    .send({ quantity: -5 });

  expect(response.status).toBe(400);
  expect(response.body).toEqual({
    message: "Quantity must be greater than or equal to 0",
  });
});

test("Sell product with insufficient stock", async () => {
  const createdProduct = await request(app).post("/api/products").send({
    name: "Test Product",
    description: "Test Description",
    price: 100,
    stock: 10,
  });

  const response = await request(app)
    .post(`/api/products/${createdProduct.body.id}/sell`)
    .send({ quantity: 15 });

  expect(response.status).toBe(400);
  expect(response.body).toEqual({
    message: "Insufficient stock",
  });
});

test("Sell product with non-existent product id", async () => {
  const response = await request(app).post("/api/products/123/sell").send({
    quantity: 5,
  });

  expect(response.status).toBe(404);
  expect(response.body).toEqual({
    message: "Product not found",
  });
});

test("Sell product with invalid product stock type", async () => {
  const createdProduct = await request(app).post("/api/products").send({
    name: "Test Product",
    description: "Test Description",
    price: 100,
    stock: 10,
  });

  const response = await request(app)
    .post(`/api/products/${createdProduct.body.id}/sell`)
    .send({ quantity: "5" });

  expect(response.status).toBe(400);
  expect(response.body).toEqual({
    message: "Quantity must be a number",
  });
});

test("Sell product without stock", async () => {
  const createdProduct = await request(app).post("/api/products").send({
    name: "Test Product",
    description: "Test Description",
    price: 100,
    stock: 0,
  });

  const response = await request(app)
    .post(`/api/products/${createdProduct.body.id}/sell`)
    .send({ quantity: 5 });

  expect(response.status).toBe(400);
  expect(response.body).toEqual({
    message: "Insufficient stock",
  });
});

test("Sell product without quantity", async () => {
  const createdProduct = await request(app).post("/api/products").send({
    name: "Test Product",
    description: "Test Description",
    price: 100,
    stock: 10,
  });

  const response = await request(app)
    .post(`/api/products/${createdProduct.body.id}/sell`)
    .send({});

  expect(response.status).toBe(400);
  expect(response.body).toEqual({
    message: "Quantity is required",
  });
});
