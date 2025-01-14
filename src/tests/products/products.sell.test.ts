import request from "supertest";
import app from "@/app";
import { findAndDeleteAllProducts } from "@/tests/utils";
import { v4 as uuidv4 } from "uuid";

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

  const createdProductId = createdProduct.body.data.id;

  const response = await request(app)
    .post(`/api/products/${createdProductId}/sell`)
    .send({ quantity: 5 });

  const soldProduct = await request(app).get(
    `/api/products/${createdProductId}`
  );

  expect(soldProduct.body.data.stock).toBe(5);

  expect(response.status).toBe(200);
  expect(response.body).toEqual({
    status: "success",
    message: "Product sold successfully",
    data: {
      id: createdProductId,
      name: "Test Product",
      description: "Test Description",
      price: 100,
      stock: 5,
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    },
  });
});

test("Sell product with invalid quantity", async () => {
  const createdProduct = await request(app).post("/api/products").send({
    name: "Test Product",
    description: "Test Description",
    price: 100,
    stock: 10,
  });

  const createdProductId = createdProduct.body.data.id;

  const response = await request(app)
    .post(`/api/products/${createdProductId}/sell`)
    .send({ quantity: -5 });

  expect(response.status).toBe(422);
  expect(response.body).toEqual({
    status: "failed",
    message: "Quantity must be greater than or equal to 0",
    data: null,
  });
});

test("Sell product with insufficient stock", async () => {
  const createdProduct = await request(app).post("/api/products").send({
    name: "Test Product",
    description: "Test Description",
    price: 100,
    stock: 10,
  });

  const createdProductId = createdProduct.body.data.id;

  const response = await request(app)
    .post(`/api/products/${createdProductId}/sell`)
    .send({ quantity: 15 });

  expect(response.status).toBe(400);
  expect(response.body).toEqual({
    status: "failed",
    message: "Insufficient stock",
    data: null,
  });
});

test("Sell product with non-existent product id", async () => {
  const response = await request(app)
    .post(`/api/products/${uuidv4()}/sell`)
    .send({
      quantity: 5,
    });

  expect(response.status).toBe(404);
  expect(response.body).toEqual({
    status: "failed",
    message: "Product not found",
    data: null,
  });
});

test("Sell product with invalid id", async () => {
  const response = await request(app)
    .post("/api/products/invalid-id/sell")
    .send({
      quantity: 5,
    });

  expect(response.status).toBe(422);
  expect(response.body).toEqual({
    status: "failed",
    message: "Invalid id",
    data: null,
  });
});

test("Sell product with invalid product stock type", async () => {
  const createdProduct = await request(app).post("/api/products").send({
    name: "Test Product",
    description: "Test Description",
    price: 100,
    stock: 10,
  });

  const createdProductId = createdProduct.body.data.id;

  const response = await request(app)
    .post(`/api/products/${createdProductId}/sell`)
    .send({ quantity: "5" });

  expect(response.status).toBe(422);
  expect(response.body).toEqual({
    status: "failed",
    message: "Quantity must be a number",
    data: null,
  });
});

test("Sell product without quantity", async () => {
  const createdProduct = await request(app).post("/api/products").send({
    name: "Test Product",
    description: "Test Description",
    price: 100,
    stock: 10,
  });

  const createdProductId = createdProduct.body.data.id;

  const response = await request(app)
    .post(`/api/products/${createdProductId}/sell`)
    .send({});

  expect(response.status).toBe(422);
  expect(response.body).toEqual({
    status: "failed",
    message: "Quantity is required",
    data: null,
  });
});

test("Sell product with decimal quantity", async () => {
  const createdProduct = await request(app).post("/api/products").send({
    name: "Test Product",
    description: "Test Description",
    price: 100,
    stock: 10,
  });

  const createdProductId = createdProduct.body.data.id;

  const response = await request(app)
    .post(`/api/products/${createdProductId}/sell`)
    .send({ quantity: 5.5 });

  expect(response.status).toBe(422);
  expect(response.body).toEqual({
    status: "failed",
    message: "Quantity must be an integer",
    data: null,
  });
});
