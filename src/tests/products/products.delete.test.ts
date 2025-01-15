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
  const response = await request(app).delete(
    `/api/products/${generateObjectId()}`
  );

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
