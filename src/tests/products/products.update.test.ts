import request from "supertest";
import app from "@/app";
import { findAndDeleteAllProducts } from "@/tests/utils";
import { v4 as uuidv4 } from "uuid";

beforeEach(async () => {
  await findAndDeleteAllProducts();
});

test("Update product name by id successfully", async () => {
  const createdProduct = await request(app).post("/api/products").send({
    name: "Test Product",
    description: "Test Description",
    price: 100,
    stock: 10,
  });

  const response = await request(app)
    .put(`/api/products/${createdProduct.body.id}`)
    .send({
      name: "Updated Product",
    });

  expect(response.status).toBe(200);
  expect(response.body).toEqual({
    message: "Product updated successfully",
  });

  const product = await request(app).get(
    `/api/products/${createdProduct.body.id}`
  );

  expect(product.status).toBe(200);
  expect(product.body).toMatchObject({
    id: createdProduct.body.id,
    name: "Updated Product",
    description: "Test Description",
    price: 100,
    stock: 10,
  });
});

test("Update product with empty object", async () => {
  const createdProduct = await request(app).post("/api/products").send({
    name: "Test Product",
    description: "Test Description",
    price: 100,
    stock: 10,
  });

  const response = await request(app)
    .put(`/api/products/${createdProduct.body.id}`)
    .send({});

  expect(response.status).toBe(400);
  expect(response.body).toEqual({
    message: "No changes to update",
  });
});

test("Update product description by id successfully", async () => {
  const createdProduct = await request(app).post("/api/products").send({
    name: "Test Product",
    description: "Test Description",
    price: 100,
    stock: 10,
  });

  const response = await request(app)
    .put(`/api/products/${createdProduct.body.id}`)
    .send({
      description: "Updated Description",
    });

  expect(response.status).toBe(200);
  expect(response.body).toEqual({
    message: "Product updated successfully",
  });

  const product = await request(app).get(
    `/api/products/${createdProduct.body.id}`
  );

  expect(product.status).toBe(200);
  expect(product.body).toMatchObject({
    id: createdProduct.body.id,
    name: "Test Product",
    description: "Updated Description",
    price: 100,
    stock: 10,
  });
});

test("Update product price by id successfully", async () => {
  const createdProduct = await request(app).post("/api/products").send({
    name: "Test Product",
    description: "Test Description",
    price: 100,
    stock: 10,
  });

  const response = await request(app)
    .put(`/api/products/${createdProduct.body.id}`)
    .send({
      price: 200,
    });

  expect(response.status).toBe(200);
  expect(response.body).toEqual({
    message: "Product updated successfully",
  });

  const product = await request(app).get(
    `/api/products/${createdProduct.body.id}`
  );

  expect(product.status).toBe(200);
  expect(product.body).toMatchObject({
    id: createdProduct.body.id,
    name: "Test Product",
    description: "Test Description",
    price: 200,
    stock: 10,
  });
});

test("Update product stock by id successfully", async () => {
  const createdProduct = await request(app).post("/api/products").send({
    name: "Test Product",
    description: "Test Description",
    price: 100,
    stock: 10,
  });

  const response = await request(app)
    .put(`/api/products/${createdProduct.body.id}`)
    .send({
      stock: 20,
    });

  expect(response.status).toBe(200);
  expect(response.body).toEqual({
    message: "Product updated successfully",
  });

  const product = await request(app).get(
    `/api/products/${createdProduct.body.id}`
  );

  expect(product.status).toBe(200);
  expect(product.body).toMatchObject({
    id: createdProduct.body.id,
    name: "Test Product",
    description: "Test Description",
    price: 100,
    stock: 20,
  });
});

test("Update multiple product fields by id successfully", async () => {
  const createdProduct = await request(app).post("/api/products").send({
    name: "Test Product",
    description: "Test Description",
    price: 100,
    stock: 10,
  });

  const response = await request(app)
    .put(`/api/products/${createdProduct.body.id}`)
    .send({
      name: "Updated Product",
      description: "Updated Description",
      price: 200,
      stock: 20,
    });

  const product = await request(app).get(
    `/api/products/${createdProduct.body.id}`
  );

  expect(product.status).toBe(200);
  expect(product.body).toMatchObject({
    id: createdProduct.body.id,
    name: "Updated Product",
    description: "Updated Description",
    price: 200,
    stock: 20,
  });

  expect(response.status).toBe(200);
  expect(response.body).toEqual({
    message: "Product updated successfully",
  });
});

test("Update product name by id with product name already exists", async () => {
  const createdProduct = await request(app).post("/api/products").send({
    name: "Test Product",
    description: "Test Description",
    price: 100,
    stock: 10,
  });

  const response = await request(app)
    .put(`/api/products/${createdProduct.body.id}`)
    .send({
      name: "Test Product",
    });

  expect(response.status).toBe(400);
  expect(response.body).toEqual({
    message: "Product name already exists",
  });
});

test("Update product description by id with no changes to update", async () => {
  const createdProduct = await request(app).post("/api/products").send({
    name: "Test Product",
    description: "Test Description",
    price: 100,
    stock: 10,
  });

  const response = await request(app)
    .put(`/api/products/${createdProduct.body.id}`)
    .send({
      description: "Test Description",
    });

  expect(response.status).toBe(400);
  expect(response.body).toEqual({
    message: "No changes to update",
  });
});

test("Update product price by id with no changes to update", async () => {
  const createdProduct = await request(app).post("/api/products").send({
    name: "Test Product",
    description: "Test Description",
    price: 100,
    stock: 10,
  });

  const response = await request(app)
    .put(`/api/products/${createdProduct.body.id}`)
    .send({
      price: 100,
    });

  expect(response.status).toBe(400);
  expect(response.body).toEqual({
    message: "No changes to update",
  });
});

test("Update product stock by id with no changes to update", async () => {
  const createdProduct = await request(app).post("/api/products").send({
    name: "Test Product",
    description: "Test Description",
    price: 100,
    stock: 10,
  });

  const response = await request(app)
    .put(`/api/products/${createdProduct.body.id}`)
    .send({
      stock: 10,
    });

  expect(response.status).toBe(400);
  expect(response.body).toEqual({
    message: "No changes to update",
  });
});

test("Update product name by id with product that does not exist", async () => {
  const response = await request(app).put(`/api/products/${uuidv4()}`).send({
    name: "Updated Product",
  });

  expect(response.status).toBe(404);
  expect(response.body).toEqual({
    message: "Product not found",
  });
});

test("Update product name by id with invalid id", async () => {
  const response = await request(app).put("/api/products/invalid-id").send({
    name: "Updated Product",
  });

  expect(response.status).toBe(400);
  expect(response.body).toEqual({
    message: "Invalid id",
  });
});

test("Update product name by id with empty product name", async () => {
  const response = await request(app).put(`/api/products/${uuidv4()}`).send({
    name: "",
  });

  expect(response.status).toBe(400);
  expect(response.body).toEqual({
    message: "Name is not allowed to be empty",
  });
});

test("Update product name by id with empty product description", async () => {
  const response = await request(app).put(`/api/products/${uuidv4()}`).send({
    description: "",
  });

  expect(response.status).toBe(400);
  expect(response.body).toEqual({
    message: "Description is not allowed to be empty",
  });
});

test("Update product name by id with invalid name type", async () => {
  const response = await request(app).put(`/api/products/${uuidv4()}`).send({
    name: 1,
  });

  expect(response.status).toBe(400);
  expect(response.body).toEqual({
    message: "Name must be a string",
  });
});

test("Update product name by id with invalid description type", async () => {
  const response = await request(app).put(`/api/products/${uuidv4()}`).send({
    description: 1,
  });

  expect(response.status).toBe(400);
  expect(response.body).toEqual({
    message: "Description must be a string",
  });
});

test("Update product name by id with invalid price type", async () => {
  const response = await request(app).put(`/api/products/${uuidv4()}`).send({
    price: "1",
  });

  expect(response.status).toBe(400);
  expect(response.body).toEqual({
    message: "Price must be a number",
  });
});

test("Update product name by id with invalid stock type", async () => {
  const response = await request(app).put(`/api/products/${uuidv4()}`).send({
    stock: "1",
  });

  expect(response.status).toBe(400);
  expect(response.body).toEqual({
    message: "Stock must be a number",
  });
});

test("Update product name by id with invalid product price", async () => {
  const response = await request(app).put(`/api/products/${uuidv4()}`).send({
    price: -1,
  });

  expect(response.status).toBe(400);
  expect(response.body).toEqual({
    message: "Price must be greater than or equal to 0",
  });
});

test("Update product name by id with invalid product stock", async () => {
  const response = await request(app).put(`/api/products/${uuidv4()}`).send({
    stock: -1,
  });

  expect(response.status).toBe(400);
  expect(response.body).toEqual({
    message: "Stock must be greater than or equal to 0",
  });
});

test("Update product name by id with invalid product name length", async () => {
  const response = await request(app)
    .put(`/api/products/${uuidv4()}`)
    .send({
      name: "Test Product".repeat(10),
    });

  expect(response.status).toBe(400);
  expect(response.body).toEqual({
    message: "Name length must be less than or equal to 50 characters long",
  });
});

test("Update product name by id with crossed description length limit", async () => {
  const response = await request(app)
    .put(`/api/products/${uuidv4()}`)
    .send({
      description: "Test Description".repeat(10),
    });

  expect(response.status).toBe(400);
  expect(response.body).toEqual({
    message:
      "Description length must be less than or equal to 50 characters long",
  });
});
