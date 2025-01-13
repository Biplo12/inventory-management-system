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

  const response = await request(app)
    .delete(`/api/products/${createdProduct.body.id}`)
    .send();

  expect(response.status).toBe(200);
  expect(response.body).toEqual({
    message: "Product deleted successfully",
  });
});

test("Delete product that does not exist", async () => {
  const response = await request(app).delete(`/api/products/${uuidv4()}`);

  expect(response.status).toBe(404);
  expect(response.body).toEqual({
    message: "Product not found",
  });
});

test("Delete product with invalid id", async () => {
  const response = await request(app).delete("/api/products/invalid-id");

  expect(response.status).toBe(400);
  expect(response.body).toEqual({
    message: "Invalid id",
  });
});
