import request from "supertest";
import app from "@/app";
import { findAndDeleteAllTestProducts } from "@/tests/utils";

beforeEach(async () => {
  await findAndDeleteAllTestProducts();
});

afterAll(async () => {
  await findAndDeleteAllTestProducts();
});

test("Create product successfully", async () => {
  const response = await request(app).post("/api/products").send({
    name: "Test Product",
    description: "Test Description",
    price: 100,
    stock: 10,
  });

  expect(response.status).toBe(201);

  expect(response.body).toEqual({
    status: "success",
    message: "Product created successfully",
    data: expect.objectContaining({
      id: expect.any(String),
      name: "Test Product",
      description: "Test Description",
      price: 100,
      stock: 10,
    }),
  });
});

test("Create product with missing stock", async () => {
  const response = await request(app).post("/api/products").send({
    name: "Test Product",
    description: "Test Description",
    price: 100,
  });

  expect(response.status).toBe(422);

  expect(response.body).toEqual({
    status: "failed",
    message: "Stock is required",
    data: null,
  });
});

test("Create product with missing name", async () => {
  const response = await request(app).post("/api/products").send({
    description: "Test Description",
    price: 100,
    stock: 10,
  });

  expect(response.status).toBe(422);

  expect(response.body).toEqual({
    status: "failed",
    message: "Name is required",
    data: null,
  });
});

test("Create product with missing description", async () => {
  const response = await request(app).post("/api/products").send({
    name: "Test Product",
    price: 100,
    stock: 10,
  });

  expect(response.status).toBe(422);

  expect(response.body).toEqual({
    status: "failed",
    message: "Description is required",
    data: null,
  });
});

test("Create product with missing price", async () => {
  const response = await request(app).post("/api/products").send({
    name: "Test Product",
    description: "Test Description",
    stock: 10,
  });

  expect(response.status).toBe(422);

  expect(response.body).toEqual({
    status: "failed",
    message: "Price is required",
    data: null,
  });
});

test("Create product without any fields", async () => {
  const response = await request(app).post("/api/products").send({});

  expect(response.status).toBe(422);

  expect(response.body).toEqual({
    status: "failed",
    message:
      "Name is required. description is required. price is required. stock is required",
    data: null,
  });
});

test("Create product with existing name", async () => {
  await request(app).post("/api/products").send({
    name: "Test Product",
    description: "Test Description",
    price: 100,
    stock: 10,
  });

  const response = await request(app).post("/api/products").send({
    name: "Test Product",
    description: "Test Description",
    price: 100,
    stock: 10,
  });

  expect(response.status).toBe(400);

  expect(response.body).toEqual({
    status: "failed",
    message: "Product already exists",
    data: null,
  });
});

test("Create product with crossed name length limit", async () => {
  const response = await request(app)
    .post("/api/products")
    .send({
      name: "Test Product".repeat(10),
      description: "Test Description",
      price: 100,
      stock: 10,
    });

  expect(response.status).toBe(422);

  expect(response.body).toEqual({
    status: "failed",
    message: "Name length must be less than or equal to 50 characters long",
    data: null,
  });
});

test("Create product with crossed description length limit", async () => {
  const response = await request(app)
    .post("/api/products")
    .send({
      name: "Test Product",
      description: "Test Description".repeat(10),
      price: 100,
      stock: 10,
    });

  expect(response.status).toBe(422);

  expect(response.body).toEqual({
    status: "failed",
    message:
      "Description length must be less than or equal to 50 characters long",
    data: null,
  });
});

test("Create product with float stock", async () => {
  const response = await request(app).post("/api/products").send({
    name: "Test Product",
    description: "Test Description",
    price: 100,
    stock: 10.5,
  });

  expect(response.status).toBe(422);

  expect(response.body).toEqual({
    status: "failed",
    message: "Stock must be an integer",
    data: null,
  });
});

test("Create product with negative stock", async () => {
  const response = await request(app).post("/api/products").send({
    name: "Test Product",
    description: "Test Description",
    price: 100,
    stock: -10,
  });

  expect(response.status).toBe(422);

  expect(response.body).toEqual({
    status: "failed",
    message: "Stock must be greater than or equal to 0",
    data: null,
  });
});

test("Create product with invalid price", async () => {
  const response = await request(app).post("/api/products").send({
    name: "Test Product",
    description: "Test Description",
    price: -100,
    stock: 10,
  });

  expect(response.status).toBe(422);

  expect(response.body).toEqual({
    status: "failed",
    message: "Price must be greater than or equal to 0",
    data: null,
  });
});

test("Create product with invalid price type", async () => {
  const response = await request(app).post("/api/products").send({
    name: "Test Product",
    description: "Test Description",
    price: "100",
    stock: 10,
  });

  expect(response.status).toBe(422);

  expect(response.body).toEqual({
    status: "failed",
    message: "Price must be a number",
    data: null,
  });
});

test("Create product with invalid stock type", async () => {
  const response = await request(app).post("/api/products").send({
    name: "Test Product",
    description: "Test Description",
    price: 100,
    stock: "10",
  });

  expect(response.status).toBe(422);

  expect(response.body).toEqual({
    status: "failed",
    message: "Stock must be a number",
    data: null,
  });
});

test("Create product with empty name", async () => {
  const response = await request(app).post("/api/products").send({
    name: "",
    description: "Test Description",
    price: 100,
    stock: 10,
  });

  expect(response.status).toBe(422);

  expect(response.body).toEqual({
    status: "failed",
    message: "Name is not allowed to be empty",
    data: null,
  });
});

test("Create product with empty description", async () => {
  const response = await request(app).post("/api/products").send({
    name: "Test Product",
    description: "",
    price: 100,
    stock: 10,
  });

  expect(response.status).toBe(422);

  expect(response.body).toEqual({
    status: "failed",
    message: "Description is not allowed to be empty",
    data: null,
  });
});
