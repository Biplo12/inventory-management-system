import request from "supertest";
import app from "@/app";
import { findAndDeleteAllProducts } from "@/tests/utils";
import { v4 as uuidv4 } from "uuid";
beforeEach(async () => {
  await findAndDeleteAllProducts();
});

test("Restock product successfully", async () => {
  const createdProduct = await request(app).post("/api/products").send({
    name: "Test Product",
    description: "Test Description",
    price: 100,
    stock: 10,
  });

  const response = await request(app)
    .post(`/api/products/${createdProduct.body.id}/restock`)
    .send({ stock: 10 });

  const restockedProduct = await request(app).get(
    `/api/products/${createdProduct.body.id}`
  );

  expect(restockedProduct.body.stock).toBe(20);

  expect(response.status).toBe(200);
  expect(response.body).toEqual({
    stock: 20,
    message: "Product restocked successfully",
  });
});

test("Restock product with invalid stock", async () => {
  const createdProduct = await request(app).post("/api/products").send({
    name: "Test Product",
    description: "Test Description",
    price: 100,
    stock: 10,
  });

  const response = await request(app)
    .post(`/api/products/${createdProduct.body.id}/restock`)
    .send({ stock: -10 });

  expect(response.status).toBe(400);
  expect(response.body).toEqual({
    message: "Stock must be greater than or equal to 0",
  });
});

test("Restock product with non-existent product id", async () => {
  const response = await request(app)
    .post(`/api/products/${uuidv4()}/restock`)
    .send({
      stock: 10,
    });

  expect(response.status).toBe(404);
  expect(response.body).toEqual({
    message: "Product not found",
  });
});

test("Restock product with invalid id", async () => {
  const response = await request(app)
    .post("/api/products/invalid-id/restock")
    .send({
      stock: 10,
    });

  expect(response.status).toBe(400);
  expect(response.body).toEqual({
    message: "Invalid id",
  });
});

test("Restock product with invalid product stock type", async () => {
  const createdProduct = await request(app).post("/api/products").send({
    name: "Test Product",
    description: "Test Description",
    price: 100,
    stock: 10,
  });

  const response = await request(app)
    .post(`/api/products/${createdProduct.body.id}/restock`)
    .send({ stock: "10" });

  expect(response.status).toBe(400);
  expect(response.body).toEqual({
    message: "Stock must be a number",
  });
});

test("Restock product without stock", async () => {
  const createdProduct = await request(app).post("/api/products").send({
    name: "Test Product",
    description: "Test Description",
    price: 100,
    stock: 10,
  });

  const response = await request(app)
    .post(`/api/products/${createdProduct.body.id}/restock`)
    .send({});

  expect(response.status).toBe(400);
  expect(response.body).toEqual({
    message: "Stock is required",
  });
});
