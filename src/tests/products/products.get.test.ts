import request from "supertest";
import app from "@/app";
import { findAndDeleteAllTestProducts } from "@/tests/utils";
import { generateObjectId } from "@/utils";

beforeEach(async () => {
  await findAndDeleteAllTestProducts();
});

test("Get one product successfully", async () => {
  const createdProduct = await request(app).post("/api/products").send({
    name: "Test Product",
    description: "Test Description",
    price: 100,
    stock: 10,
  });

  const createdProductId = createdProduct.body.data.id;

  const response = await request(app).get("/api/products");

  expect(response.status).toBe(200);

  expect(response.body).toEqual({
    status: "success",
    message: "Products fetched successfully",
    data: expect.arrayContaining([
      {
        id: createdProductId,
        name: "Test Product",
        description: "Test Description",
        price: 100,
        stock: 10,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      },
    ]),
  });
});

test("Get multiple products successfully", async () => {
  const createdProduct = await request(app).post("/api/products").send({
    name: "Test Product",
    description: "Test Description",
    price: 100,
    stock: 10,
  });

  const createdProductId = createdProduct.body.data.id;

  const secondProduct = await request(app).post("/api/products").send({
    name: "Second Product",
    description: "Second Description",
    price: 200,
    stock: 20,
  });

  const secondProductId = secondProduct.body.data.id;

  const response = await request(app).get("/api/products");

  expect(response.status).toBe(200);

  expect(response.body).toEqual({
    status: "success",
    message: "Products fetched successfully",
    data: expect.arrayContaining([
      {
        id: createdProductId,
        name: "Test Product",
        description: "Test Description",
        price: 100,
        stock: 10,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      },
      {
        id: secondProductId,
        name: "Second Product",
        description: "Second Description",
        price: 200,
        stock: 20,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      },
    ]),
  });
});

test("Get product by id successfully", async () => {
  const createdProduct = await request(app).post("/api/products").send({
    name: "Test Product",
    description: "Test Description",
    price: 100,
    stock: 10,
  });

  const createdProductId = createdProduct.body.data.id;

  const response = await request(app).get(`/api/products/${createdProductId}`);

  expect(response.status).toBe(200);
  expect(response.body).toMatchObject({
    status: "success",
    message: "Product fetched successfully",
    data: {
      id: createdProductId,
      name: "Test Product",
      description: "Test Description",
      price: 100,
      stock: 10,
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    },
  });
});

test("Get product by id with non existing id", async () => {
  const response = await request(app).get(
    `/api/products/${generateObjectId()}`
  );

  expect(response.status).toBe(404);
  expect(response.body).toEqual({
    status: "failed",
    message: "Product not found",
    data: null,
  });
});

test("Get product by id with invalid id", async () => {
  const response = await request(app).get("/api/products/invalid-id");

  expect(response.status).toBe(422);
  expect(response.body).toEqual({
    status: "failed",
    message: "Invalid id",
    data: null,
  });
});
