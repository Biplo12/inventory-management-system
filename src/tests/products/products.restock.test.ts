import request from "supertest";
import app from "@/app";
import { findAndDeleteAllTestProducts } from "@/tests/utils";
import { generateObjectId } from "@/utils";

beforeEach(async () => {
  await findAndDeleteAllTestProducts();
});

afterAll(async () => {
  await findAndDeleteAllTestProducts();
});

test("Restock product successfully", async () => {
  const createdProduct = await request(app).post("/api/products").send({
    name: "Test Product",
    description: "Test Description",
    price: 100,
    stock: 10,
  });

  const createdProductId = createdProduct.body.data.id;

  const response = await request(app)
    .post(`/api/products/${createdProductId}/restock`)
    .send({ stock: 10 });

  const restockedProduct = await request(app).get(
    `/api/products/${createdProductId}`
  );

  const restockedProductStock = restockedProduct.body.data.stock;

  expect(restockedProductStock).toBe(20);

  expect(response.status).toBe(200);
  expect(response.body).toEqual({
    status: "success",
    message: "Product restocked successfully",
    data: {
      id: createdProductId,
      name: "Test Product",
      description: "Test Description",
      price: 100,
      stock: 20,
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    },
  });
});

test("Restock product with invalid stock", async () => {
  const createdProduct = await request(app).post("/api/products").send({
    name: "Test Product",
    description: "Test Description",
    price: 100,
    stock: 10,
  });

  const createdProductId = createdProduct.body.data.id;

  const response = await request(app)
    .post(`/api/products/${createdProductId}/restock`)
    .send({ stock: -10 });

  expect(response.status).toBe(422);
  expect(response.body).toEqual({
    status: "failed",
    message: "Stock must be greater than or equal to 0",
    data: null,
  });
});

test("Restock product with non-existent product id", async () => {
  const response = await request(app)
    .post(`/api/products/${generateObjectId()}/restock`)
    .send({
      stock: 10,
    });

  expect(response.status).toBe(404);
  expect(response.body).toEqual({
    status: "failed",
    message: "Product not found",
    data: null,
  });
});

test("Restock product with invalid id", async () => {
  const response = await request(app)
    .post("/api/products/invalid-id/restock")
    .send({
      stock: 10,
    });

  expect(response.status).toBe(422);
  expect(response.body).toEqual({
    status: "failed",
    message: "Invalid id",
    data: null,
  });
});

test("Restock product with invalid product stock type", async () => {
  const createdProduct = await request(app).post("/api/products").send({
    name: "Test Product",
    description: "Test Description",
    price: 100,
    stock: 10,
  });

  const createdProductId = createdProduct.body.data.id;

  const response = await request(app)
    .post(`/api/products/${createdProductId}/restock`)
    .send({ stock: "10" });

  expect(response.status).toBe(422);
  expect(response.body).toEqual({
    status: "failed",
    message: "Stock must be a number",
    data: null,
  });
});

test("Restock product without stock", async () => {
  const createdProduct = await request(app).post("/api/products").send({
    name: "Test Product",
    description: "Test Description",
    price: 100,
    stock: 10,
  });

  const createdProductId = createdProduct.body.data.id;

  const response = await request(app)
    .post(`/api/products/${createdProductId}/restock`)
    .send({});

  expect(response.status).toBe(422);
  expect(response.body).toEqual({
    status: "failed",
    message: "Stock is required",
    data: null,
  });
});

test("Restock product with decimal stock", async () => {
  const createdProduct = await request(app).post("/api/products").send({
    name: "Test Product",
    description: "Test Description",
    price: 100,
    stock: 10,
  });

  const createdProductId = createdProduct.body.data.id;

  const response = await request(app)
    .post(`/api/products/${createdProductId}/restock`)
    .send({ stock: 10.5 });

  expect(response.status).toBe(422);
  expect(response.body).toEqual({
    status: "failed",
    message: "Stock must be an integer",
    data: null,
  });
});
