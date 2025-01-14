import request from "supertest";
import app from "@/app";
import { findAndDeleteAllTestProducts } from "@/tests/utils";
import { generateObjectId } from "@/utils";

beforeEach(async () => {
  await findAndDeleteAllTestProducts();
});

test("Update product name by id successfully", async () => {
  const createdProduct = await request(app).post("/api/products").send({
    name: "Test Product",
    description: "Test Description",
    price: 100,
    stock: 10,
  });

  const createdProductId = createdProduct.body.data.id;

  const response = await request(app)
    .put(`/api/products/${createdProductId}`)
    .send({
      name: "Updated Product",
    });

  expect(response.status).toBe(200);
  expect(response.body).toEqual({
    status: "success",
    message: "Product updated successfully",
    data: {
      id: createdProductId,
      name: "Updated Product",
      description: "Test Description",
      price: 100,
      stock: 10,
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    },
  });

  const product = await request(app).get(`/api/products/${createdProductId}`);

  expect(product.status).toBe(200);
  expect(product.body).toMatchObject({
    status: "success",
    message: "Product fetched successfully",
    data: {
      id: createdProductId,
      name: "Updated Product",
      description: "Test Description",
      price: 100,
      stock: 10,
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    },
  });
});

test("Update product with empty object", async () => {
  const createdProduct = await request(app).post("/api/products").send({
    name: "Test Product",
    description: "Test Description",
    price: 100,
    stock: 10,
  });

  const createdProductId = createdProduct.body.data.id;

  const response = await request(app)
    .put(`/api/products/${createdProductId}`)
    .send({});

  expect(response.status).toBe(400);
  expect(response.body).toEqual({
    status: "failed",
    message: "No changes to update",
    data: null,
  });
});

test("Update product description by id successfully", async () => {
  const createdProduct = await request(app).post("/api/products").send({
    name: "Test Product",
    description: "Test Description",
    price: 100,
    stock: 10,
  });

  const createdProductId = createdProduct.body.data.id;

  const response = await request(app)
    .put(`/api/products/${createdProductId}`)
    .send({
      description: "Updated Description",
    });

  expect(response.status).toBe(200);
  expect(response.body).toEqual({
    status: "success",
    message: "Product updated successfully",
    data: {
      id: createdProductId,
      name: "Test Product",
      description: "Updated Description",
      price: 100,
      stock: 10,
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    },
  });

  const product = await request(app).get(`/api/products/${createdProductId}`);

  expect(product.status).toBe(200);
  expect(product.body).toMatchObject({
    status: "success",
    message: "Product fetched successfully",
    data: {
      id: createdProductId,
      name: "Test Product",
      description: "Updated Description",
      price: 100,
      stock: 10,
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    },
  });
});

test("Update product price by id successfully", async () => {
  const createdProduct = await request(app).post("/api/products").send({
    name: "Test Product",
    description: "Test Description",
    price: 100,
    stock: 10,
  });

  const createdProductId = createdProduct.body.data.id;

  const response = await request(app)
    .put(`/api/products/${createdProductId}`)
    .send({
      price: 200,
    });

  expect(response.status).toBe(200);
  expect(response.body).toEqual({
    status: "success",
    message: "Product updated successfully",
    data: {
      id: createdProductId,
      name: "Test Product",
      description: "Test Description",
      price: 200,
      stock: 10,
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    },
  });

  const product = await request(app).get(`/api/products/${createdProductId}`);

  expect(product.status).toBe(200);
  expect(product.body).toMatchObject({
    status: "success",
    message: "Product fetched successfully",
    data: {
      id: createdProductId,
      name: "Test Product",
      description: "Test Description",
      price: 200,
      stock: 10,
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    },
  });
});

test("Update product stock by id successfully", async () => {
  const createdProduct = await request(app).post("/api/products").send({
    name: "Test Product",
    description: "Test Description",
    price: 100,
    stock: 10,
  });

  const createdProductId = createdProduct.body.data.id;

  const response = await request(app)
    .put(`/api/products/${createdProductId}`)
    .send({
      stock: 20,
    });

  expect(response.status).toBe(200);
  expect(response.body).toEqual({
    status: "success",
    message: "Product updated successfully",
    data: {
      id: createdProductId,
      name: "Test Product",
      description: "Test Description",
      price: 100,
      stock: 20,
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    },
  });

  const product = await request(app).get(`/api/products/${createdProductId}`);

  expect(product.status).toBe(200);
  expect(product.body).toMatchObject({
    status: "success",
    message: "Product fetched successfully",
    data: {
      id: createdProductId,
      name: "Test Product",
      description: "Test Description",
      price: 100,
      stock: 20,
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    },
  });
});

test("Update multiple product fields by id successfully", async () => {
  const createdProduct = await request(app).post("/api/products").send({
    name: "Test Product",
    description: "Test Description",
    price: 100,
    stock: 10,
  });

  const createdProductId = createdProduct.body.data.id;

  const response = await request(app)
    .put(`/api/products/${createdProductId}`)
    .send({
      name: "Updated Product",
      description: "Updated Description",
      price: 200,
      stock: 20,
    });

  const product = await request(app).get(`/api/products/${createdProductId}`);

  expect(product.status).toBe(200);
  expect(product.body).toMatchObject({
    status: "success",
    message: "Product fetched successfully",
    data: {
      id: createdProductId,
      name: "Updated Product",
      description: "Updated Description",
      price: 200,
      stock: 20,
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    },
  });

  expect(response.status).toBe(200);
  expect(response.body).toMatchObject({
    status: "success",
    message: "Product updated successfully",
    data: {
      id: createdProductId,
      name: "Updated Product",
      description: "Updated Description",
      price: 200,
      stock: 20,
    },
  });
});

test("Update product name by id with product name already exists", async () => {
  const createdProduct = await request(app).post("/api/products").send({
    name: "Test Product",
    description: "Test Description",
    price: 100,
    stock: 10,
  });

  const createdProductId = createdProduct.body.data.id;

  const response = await request(app)
    .put(`/api/products/${createdProductId}`)
    .send({
      name: "Test Product",
    });

  expect(response.status).toBe(400);
  expect(response.body).toEqual({
    status: "failed",
    message: "Product name already exists",
    data: null,
  });
});

test("Update product description by id with no changes to update", async () => {
  const createdProduct = await request(app).post("/api/products").send({
    name: "Test Product",
    description: "Test Description",
    price: 100,
    stock: 10,
  });

  const createdProductId = createdProduct.body.data.id;

  const response = await request(app)
    .put(`/api/products/${createdProductId}`)
    .send({
      description: "Test Description",
    });

  expect(response.status).toBe(400);
  expect(response.body).toEqual({
    status: "failed",
    message: "No changes to update",
    data: null,
  });
});

test("Update product price by id with no changes to update", async () => {
  const createdProduct = await request(app).post("/api/products").send({
    name: "Test Product",
    description: "Test Description",
    price: 100,
    stock: 10,
  });

  const createdProductId = createdProduct.body.data.id;

  const response = await request(app)
    .put(`/api/products/${createdProductId}`)
    .send({
      price: 100,
    });

  expect(response.status).toBe(400);
  expect(response.body).toEqual({
    status: "failed",
    message: "No changes to update",
    data: null,
  });
});

test("Update product stock by id with no changes to update", async () => {
  const createdProduct = await request(app).post("/api/products").send({
    name: "Test Product",
    description: "Test Description",
    price: 100,
    stock: 10,
  });

  const createdProductId = createdProduct.body.data.id;

  const response = await request(app)
    .put(`/api/products/${createdProductId}`)
    .send({
      stock: 10,
    });

  expect(response.status).toBe(400);
  expect(response.body).toEqual({
    status: "failed",
    message: "No changes to update",
    data: null,
  });
});

test("Update product name by id with product that does not exist", async () => {
  const response = await request(app)
    .put(`/api/products/${generateObjectId()}`)
    .send({
      name: "Updated Product",
    });

  expect(response.status).toBe(404);
  expect(response.body).toEqual({
    status: "failed",
    message: "Product not found",
    data: null,
  });
});

test("Update product name by id with invalid id", async () => {
  const response = await request(app).put("/api/products/invalid-id").send({
    name: "Updated Product",
  });

  expect(response.status).toBe(422);
  expect(response.body).toEqual({
    status: "failed",
    message: "Invalid id",
    data: null,
  });
});

test("Update product name by id with empty product name", async () => {
  const response = await request(app)
    .put(`/api/products/${generateObjectId()}`)
    .send({
      name: "",
    });

  expect(response.status).toBe(422);
  expect(response.body).toEqual({
    status: "failed",
    message: "Name is not allowed to be empty",
    data: null,
  });
});

test("Update product name by id with empty product description", async () => {
  const response = await request(app)
    .put(`/api/products/${generateObjectId()}`)
    .send({
      description: "",
    });

  expect(response.status).toBe(422);
  expect(response.body).toEqual({
    status: "failed",
    message: "Description is not allowed to be empty",
    data: null,
  });
});

test("Update product name by id with invalid name type", async () => {
  const response = await request(app)
    .put(`/api/products/${generateObjectId()}`)
    .send({
      name: 1,
    });

  expect(response.status).toBe(422);
  expect(response.body).toEqual({
    status: "failed",
    message: "Name must be a string",
    data: null,
  });
});

test("Update product name by id with invalid description type", async () => {
  const response = await request(app)
    .put(`/api/products/${generateObjectId()}`)
    .send({
      description: 1,
    });

  expect(response.status).toBe(422);
  expect(response.body).toEqual({
    status: "failed",
    message: "Description must be a string",
    data: null,
  });
});

test("Update product name by id with invalid price type", async () => {
  const response = await request(app)
    .put(`/api/products/${generateObjectId()}`)
    .send({
      price: "1",
    });

  expect(response.status).toBe(422);
  expect(response.body).toEqual({
    status: "failed",
    message: "Price must be a number",
    data: null,
  });
});

test("Update product name by id with invalid stock type", async () => {
  const response = await request(app)
    .put(`/api/products/${generateObjectId()}`)
    .send({
      stock: "1",
    });

  expect(response.status).toBe(422);
  expect(response.body).toEqual({
    status: "failed",
    message: "Stock must be a number",
    data: null,
  });
});

test("Update product name by id with invalid product price", async () => {
  const response = await request(app)
    .put(`/api/products/${generateObjectId()}`)
    .send({
      price: -1,
    });

  expect(response.status).toBe(422);
  expect(response.body).toEqual({
    status: "failed",
    message: "Price must be greater than or equal to 0",
    data: null,
  });
});

test("Update product name by id with invalid product stock", async () => {
  const response = await request(app)
    .put(`/api/products/${generateObjectId()}`)
    .send({
      stock: -1,
    });

  expect(response.status).toBe(422);
  expect(response.body).toEqual({
    status: "failed",
    message: "Stock must be greater than or equal to 0",
    data: null,
  });
});

test("Update product name by id with invalid product name length", async () => {
  const response = await request(app)
    .put(`/api/products/${generateObjectId()}`)
    .send({
      name: "Test Product".repeat(10),
    });

  expect(response.status).toBe(422);
  expect(response.body).toEqual({
    status: "failed",
    message: "Name length must be less than or equal to 50 characters long",
    data: null,
  });
});

test("Update product name by id with crossed description length limit", async () => {
  const response = await request(app)
    .put(`/api/products/${generateObjectId()}`)
    .send({
      description: "Test Description".repeat(10),
    });

  expect(response.status).toBe(422);
  expect(response.body).toEqual({
    status: "failed",
    message:
      "Description length must be less than or equal to 50 characters long",
    data: null,
  });
});
