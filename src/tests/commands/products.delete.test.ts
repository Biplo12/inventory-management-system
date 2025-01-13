import request from "supertest";
import app from "@/app";
import { findAndDeleteAllProducts } from "@/tests/utils";

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

test("Delete product with invalid id", async () => {
  const response = await request(app).delete("/api/products/invalid-id").send();

  expect(response.status).toBe(404);
  expect(response.body).toEqual({
    message: "Product not found",
  });
});
