import request from "supertest";
import app from "@/app";
import {
  findAndDeleteAllTestOrders,
  findAndDeleteAllTestProducts,
} from "@/tests/utils";
import { generateObjectId } from "@/utils";

beforeEach(async () => {
  await findAndDeleteAllTestProducts();
  await findAndDeleteAllTestOrders();
});

afterAll(async () => {
  await findAndDeleteAllTestProducts();
  await findAndDeleteAllTestOrders();
});

test("create order with one product successfully", async () => {
  const createdProduct = await request(app).post("/api/products").send({
    name: "Test Product",
    description: "Test Description",
    price: 100,
    stock: 10,
  });

  const createdProductId = createdProduct.body.data.id;
  const customerId = generateObjectId();

  const response = await request(app)
    .post("/api/orders")
    .send({
      customerId,
      products: [{ productId: createdProductId, quantity: 1 }],
    });

  expect(response.status).toBe(201);
  expect(response.body).toEqual({
    status: "success",
    message: "Order created successfully",
    data: expect.objectContaining({
      id: response.body.data.id,
      customerId,
      orderItems: [
        {
          id: expect.any(String),
          productId: createdProductId,
          orderId: response.body.data.id,
          quantity: 1,
        },
      ],
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    }),
  });
});

test("create order with insufficient stock", async () => {
  const createdProduct = await request(app).post("/api/products").send({
    name: "Test Product",
    description: "Test Description",
    price: 100,
    stock: 10,
  });

  const createdProductId = createdProduct.body.data.id;
  const customerId = generateObjectId();

  const response = await request(app)
    .post("/api/orders")
    .send({
      customerId,
      products: [{ productId: createdProductId, quantity: 11 }],
    });

  expect(response.status).toBe(400);
  expect(response.body).toEqual({
    status: "failed",
    message: `Insufficient stock for product ID ${createdProductId}`,
    data: null,
  });
});

test("create order with invalid product id", async () => {
  const customerId = generateObjectId();

  const response = await request(app)
    .post("/api/orders")
    .send({
      customerId,
      products: [{ productId: "invalid-id", quantity: 1 }],
    });

  expect(response.status).toBe(400);
  expect(response.body).toEqual({
    status: "failed",
    message: "Invalid id",
    data: null,
  });
});

test("create order with invalid quantity", async () => {
  const createdProduct = await request(app).post("/api/products").send({
    name: "Test Product",
    description: "Test Description",
    price: 100,
    stock: 10,
  });

  const createdProductId = createdProduct.body.data.id;
  const customerId = generateObjectId();

  const response = await request(app)
    .post("/api/orders")
    .send({
      customerId,
      products: [{ productId: createdProductId, quantity: 0 }],
    });

  expect(response.status).toBe(400);
  expect(response.body).toEqual({
    status: "failed",
    message: "Quantity must be greater than or equal to 1",
    data: null,
  });
});

test("create order with invalid products", async () => {
  const customerId = generateObjectId();

  const response = await request(app).post("/api/orders").send({
    customerId,
    products: [],
  });

  expect(response.status).toBe(400);
  expect(response.body).toEqual({
    status: "failed",
    message: "Products must not be empty",
    data: null,
  });
});

test("create order with invalid customer id", async () => {
  const customerId = "invalid-id";

  const response = await request(app)
    .post("/api/orders")
    .send({
      customerId,
      products: [{ productId: "valid-id", quantity: 1 }],
    });

  expect(response.status).toBe(400);
  expect(response.body).toEqual({
    status: "failed",
    message: "Invalid id",
    data: null,
  });
});

test("create order with empty object", async () => {
  const response = await request(app).post("/api/orders").send({});

  expect(response.status).toBe(400);
  expect(response.body).toEqual({
    status: "failed",
    message: "Customer id is required",
    data: null,
  });
});

test("create order with missing customer id", async () => {
  const response = await request(app)
    .post("/api/orders")
    .send({
      products: [{ productId: "valid-id", quantity: 1 }],
    });

  expect(response.status).toBe(400);
  expect(response.body).toEqual({
    status: "failed",
    message: "Customer id is required",
    data: null,
  });
});

test("create order with missing products", async () => {
  const customerId = generateObjectId();

  const response = await request(app).post("/api/orders").send({ customerId });

  expect(response.status).toBe(400);
  expect(response.body).toEqual({
    status: "failed",
    message: "Products must not be empty",
    data: null,
  });
});

test("create order without quantity", async () => {
  const createdProduct = await request(app).post("/api/products").send({
    name: "Test Product",
    description: "Test Description",
    price: 100,
    stock: 10,
  });

  const createdProductId = createdProduct.body.data.id;
  const customerId = generateObjectId();

  const response = await request(app)
    .post("/api/orders")
    .send({
      customerId,
      products: [{ productId: createdProductId }],
    });

  expect(response.status).toBe(400);
  expect(response.body).toEqual({
    status: "failed",
    message: "Quantity is required",
    data: null,
  });
});

test("create order with invalid quantity type", async () => {
  const createdProduct = await request(app).post("/api/products").send({
    name: "Test Product",
    description: "Test Description",
    price: 100,
    stock: 10,
  });

  const createdProductId = createdProduct.body.data.id;
  const customerId = generateObjectId();

  const response = await request(app)
    .post("/api/orders")
    .send({
      customerId,
      products: [{ productId: createdProductId, quantity: "10" }],
    });

  expect(response.status).toBe(400);
  expect(response.body).toEqual({
    status: "failed",
    message: "Quantity must be a number",
    data: null,
  });
});
