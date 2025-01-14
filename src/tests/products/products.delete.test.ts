import request from "supertest";
import app from "@/app";
import { findAndDeleteAllProducts } from "@/tests/utils";
import { v4 as uuidv4 } from "uuid";
beforeEach(async () => {
  await findAndDeleteAllProducts();
});

test("Delete product successfully", async () => {
  const createdProduct = await request(app).post("/api/products").send({
    name: "Test Product",
    description: "Test Description",
    price: 100,
    stock: 10,
  });

  const createdProductId = createdProduct.body.data.id;

  const response = await request(app)
    .delete(`/api/products/${createdProductId}`)
    .send();

  expect(response.status).toBe(200);
  expect(response.body).toEqual({
    status: "success",
    message: "Product deleted successfully",
    data: null,
  });
});

test("Delete product that does not exist", async () => {
  const response = await request(app).delete(`/api/products/${uuidv4()}`);

  expect(response.status).toBe(404);
  expect(response.body).toEqual({
    status: "failed",
    message: "Product not found",
    data: null,
  });
});

test("Delete product with invalid id", async () => {
  const response = await request(app).delete("/api/products/invalid-id");

  expect(response.status).toBe(422);
  expect(response.body).toEqual({
    status: "failed",
    message: "Invalid id",
    data: null,
  });
});
