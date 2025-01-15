import request from "supertest";
import app from "@/app";

test("should return 404 for undefined routes", async () => {
  const response = await request(app).get("/undefined-route");

  expect(response.status).toBe(404);
  expect(response.body).toEqual({
    status: "failed",
    message: "Endpoint not found",
    data: null,
  });
});
