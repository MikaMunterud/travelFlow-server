const request = require("supertest");
const { db } = require("../src/database/database");
const { server } = require("../src/server/server");

beforeAll(async () => {
  await db.connect();
});

afterAll(async () => {
  await db.disconnect();
});

describe("getAllUsers", () => {
  test("returns an array with a property of users and 200 as status", async () => {
    const response = await request(server).get("/users/allUsers");
    expect(response.body).toHaveProperty("users");
    expect(Array.isArray(response.body.users)).toBe(true);
    expect(response.status).toBe(200);
  });
});
