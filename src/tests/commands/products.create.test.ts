import request from "supertest";
import { app } from "@/server";

test("Create product successfully", async () => {
  const response = await request(app).post("/api/products").send({
    name: "Test Product",
    description: "Test Description",
    price: 100,
    stock: 10,
  });

  expect(response.status).toBe(201);

  expect(response.body).toEqual({
    id: expect.any(String),
    message: "Product created successfully",
  });
});

test("Create product with missing fields", async () => {
  const response = await request(app).post("/api/products").send({
    name: "Test Product",
    description: "Test Description",
    price: 100,
  });

  expect(response.status).toBe(400);

  expect(response.body).toEqual({
    message: "Stock is required",
  });
});

test("Create product with existing name", async () => {
  const response = await request(app).post("/api/products").send({
    name: "Test Product",
    description: "Test Description",
    price: 100,
    stock: 10,
  });

  await request(app).post("/api/products").send({
    name: "Test Product",
    description: "Test Description",
    price: 100,
    stock: 10,
  });

  expect(response.status).toBe(400);

  expect(response.body).toEqual({
    message: "Product already exists",
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

  expect(response.status).toBe(400);

  expect(response.body).toEqual({
    message: "Name length must be less than or equal to 50 characters long",
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

  expect(response.status).toBe(400);

  expect(response.body).toEqual({
    message:
      "Description length must be less than or equal to 50 characters long",
  });
});

test("Create product with float stock", async () => {
  const response = await request(app).post("/api/products").send({
    name: "Test Product",
    description: "Test Description",
    price: 100,
    stock: 10.5,
  });

  expect(response.status).toBe(400);

  expect(response.body).toEqual({
    message: "Stock must be an integer",
  });
});

test("Create product with negative stock", async () => {
  const response = await request(app).post("/api/products").send({
    name: "Test Product",
    description: "Test Description",
    price: 100,
    stock: -10,
  });

  expect(response.status).toBe(400);

  expect(response.body).toEqual({
    message: "Stock must be greater than or equal to 0",
  });
});

test("Create product with invalid price", async () => {
  const response = await request(app).post("/api/products").send({
    name: "Test Product",
    description: "Test Description",
    price: -100,
    stock: 10,
  });

  expect(response.status).toBe(400);

  expect(response.body).toEqual({
    message: "Price must be greater than or equal to 0",
  });
});

test("Create product with invalid price type", async () => {
  const response = await request(app).post("/api/products").send({
    name: "Test Product",
    description: "Test Description",
    price: "100",
    stock: 10,
  });

  expect(response.status).toBe(400);

  expect(response.body).toEqual({
    message: "Price must be a number",
  });
});

test("Create product with invalid stock type", async () => {
  const response = await request(app).post("/api/products").send({
    name: "Test Product",
    description: "Test Description",
    price: 100,
    stock: "10",
  });

  expect(response.status).toBe(400);

  expect(response.body).toEqual({
    message: "Stock must be a number",
  });
});

test("Create product with empty name", async () => {
  const response = await request(app).post("/api/products").send({
    name: "",
    description: "Test Description",
    price: 100,
    stock: 10,
  });

  expect(response.status).toBe(400);

  expect(response.body).toEqual({
    message: "Name is not allowed to be empty",
  });
});

test("Create product with empty description", async () => {
  const response = await request(app).post("/api/products").send({
    name: "Test Product",
    description: "",
    price: 100,
    stock: 10,
  });

  expect(response.status).toBe(400);

  expect(response.body).toEqual({
    message: "Description is not allowed to be empty",
  });
});
