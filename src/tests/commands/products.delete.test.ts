import request from "supertest";
import { app } from "@/app";

test("Delete product successfully", async () => {
  const createdProduct = await request(app).post("/api/products").send({
    name: "Test Product",
    description: "Test Description",
    price: 100,
    stock: 10,
  });

  const response = await request(app).delete("/api/products").send({
    id: createdProduct.body.id,
  });

  expect(response.status).toBe(200);

  expect(response.body).toEqual({
    message: "Product deleted successfully",
  });
});

test("Delete product with invalid id", async () => {
  const response = await request(app).delete("/api/products").send({
    id: "invalid-id",
  });

  expect(response.status).toBe(400);

  expect(response.body).toEqual({
    message: "Product not found",
  });
});

test("Delete product with invalid id type", async () => {
  const response = await request(app).delete("/api/products").send({
    id: 1,
  });

  expect(response.status).toBe(400);

  expect(response.body).toEqual({
    message: "Value must be a string",
  });
});

test("Delete product without id", async () => {
  const response = await request(app).delete("/api/products").send({});

  expect(response.status).toBe(400);

  expect(response.body).toEqual({
    message: "Value is required",
  });
});

test("Delete product with empty id", async () => {
  const response = await request(app).delete("/api/products").send({
    id: "",
  });

  expect(response.status).toBe(400);

  expect(response.body).toEqual({
    message: "Value must be a string",
  });
});
