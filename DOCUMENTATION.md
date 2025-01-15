# Inventory Management System Documentation

## Overview

This Inventory Management System is specifically designed for the recruitment process at CoffeeMug company. It leverages Prisma as an ORM to interact with a MongoDB database, ensuring robust data management and operations. The system provides endpoints to create, read, update, and delete products, as well as manage stock levels and orders.

## Setup

### Environment Setup

- **Node.js**: Ensure Node.js (version 18.0.0 or higher) is installed on your machine.
- **Install Dependencies**: Run `yarn install` to install all required dependencies.
- **Database Configuration**: Set up your database connection strings and other configurations in a `.env` file based on the `.env.example` provided.

### Running the Application

- **Development Mode**:

  ```bash
  yarn dev
  ```

  This command starts the server with `nodemon` for hot reloading.

- **Production Mode**:

  ```bash
  yarn start
  ```

  This command compiles the TypeScript files and starts the production server.

- **Testing**:
  ```bash
  yarn test
  ```
  This command runs the test suite to ensure all functionalities work as expected.

## API Endpoints

### Products

#### GET /api/products

Retrieves a list of all products.

- **Success Response**:
  - **Code**: 200
  - **Content**: `{ status: "success", message: "Products fetched successfully", data: [array of products] }`

#### GET /api/products/:id

Retrieves a product by its ID.

- **Parameters**:
  - `id`: Product ID
- **Success Response**:
  - **Code**: 200
  - **Content**: `{ status: "success", message: "Product fetched successfully", data: { product details } }`

#### POST /api/products

Creates a new product with the required fields: name, description, price, and stock.

- **Body**:
  ```json
  {
    "name": "Example Product",
    "description": "Example Description",
    "price": 100,
    "stock": 50
  }
  ```
- **Success Response**:
  - **Code**: 201
  - **Content**: `{ status: "success", message: "Product created successfully", data: { product details } }`
- **Error Response**:
  - **Code**: 400
  - **Content**: `{ status: "failed", message: "Validation error", data: null }`

#### PUT /api/products/:id

Updates an existing product.

- **Parameters**:
  - `id`: Product ID
- **Body**:
  ```json
  {
    "name": "Updated Product",
    "description": "Updated Description",
    "price": 150,
    "stock": 60
  }
  ```
- **Success Response**:
  - **Code**: 200
  - **Content**: `{ status: "success", message: "Product updated successfully", data: { updated product details } }`

#### DELETE /api/products/:id

Deletes a product by ID.

- **Parameters**:
  - `id`: Product ID
- **Success Response**:
  - **Code**: 200
  - **Content**: `{ status: "success", message: "Product deleted successfully", data: null }`

#### POST /api/products/:id/restock

Increases the stock level of a product.

- **Parameters**:
  - `id`: Product ID
- **Body**:
  ```json
  {
    "stock": 20
  }
  ```
- **Success Response**:
  - **Code**: 200
  - **Content**: `{ status: "success", message: "Product restocked successfully", data: { updated product details } }`

#### POST /api/products/:id/sell

Decreases the stock level of a product, ensuring the stock does not go below zero.

- **Parameters**:
  - `id`: Product ID
- **Body**:
  ```json
  {
    "quantity": 5
  }
  ```
- **Success Response**:
  - **Code**: 200
  - **Content**: `{ status: "success", message: "Product sold successfully", data: { updated product details } }`

### Orders

#### POST /api/orders

Creates a new order with customer ID and product details.

- **Body**:
  ```json
  {
    "customerId": "cust123",
    "products": [
      {
        "productId": "prod123",
        "quantity": 1
      }
    ]
  }
  ```
- **Success Response**:
  - **Code**: 201
  - **Content**: `{ status: "success", message: "Order created successfully", data: { order details } }`
- **Error Response**:
  - **Code**: 400
  - **Content**: `{ status: "failed", message: "Insufficient stock", data: null }`

## Error Handling

Proper error handling is implemented to ensure that any issues are reported clearly to the client. This includes handling database errors, validation errors, and unexpected conditions.

## Testing

Comprehensive tests are written to cover all aspects of the API, ensuring reliability and functionality. Use `yarn test` to run the test suite and verify that all endpoints perform as expected.
