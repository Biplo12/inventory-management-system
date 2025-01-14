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
      products: [
        {
          id: response.body.data.products[0].id,
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
