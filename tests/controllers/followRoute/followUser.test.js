const request = require("supertest");
const { db } = require("../../../src/database/database");
const { server } = require("../../../src/server/server");

beforeAll(async function () {
  await db.connect();
});

afterAll(async function () {
  await db.disconnect();
});

describe("Testing followUser endpoint", () => {
  test("POST /following/follow should return 200 if user followed successfully", async () => {
    const logInResponse = await request(server)
      .post("/authentication/login")
      .send({
        username: "test",
        password: "testingAccount",
      });
    const cookie = logInResponse.header["set-cookie"].pop();

    const response = await request(server)
      .post("/following/follow")
      .send({ username: "Mika" })
      .set("Cookie", cookie);

    expect(response.status).toBe(200);
  });

  test("POST /following/follow should return 400 if user tries to follow themselves", async () => {
    const logInResponse = await request(server)
      .post("/authentication/login")
      .send({ username: "test", password: "testingAccount" });

    const cookie = logInResponse.header["set-cookie"].pop();
    const response = await request(server)
      .post("/following/follow")
      .send({ username: "test" })
      .set("Cookie", cookie);

    expect(response.status).toBe(400);
  });

  test("POST /following/follow should return 404 if user tries to follow a non-existent user", async () => {
    const loginResponse = await request(server)
      .post("/authentication/login")
      .send({
        username: "test",
        password: "testingAccount",
      });

    const cookie = loginResponse.header["set-cookie"];
    const response = await request(server)
      .post("/following/follow")
      .send({ username: "test3" })
      .set("Cookie", cookie);

    expect(response.status).toBe(404);
  });

  test("DELETE /following/unFollow should return 200 if user unfollowed successfully", async () => {
    const logInResponse = await request(server)
      .post("/authentication/login")
      .send({
        username: "test",
        password: "testingAccount",
      });
    const cookie = logInResponse.header["set-cookie"].pop();

    const responseUnFollow = await request(server)
      .delete("/following/unFollow")
      .send({ username: "Mika" })
      .set("Cookie", cookie);

    expect(responseUnFollow.status).toBe(200);
  });

  test("DELETE /following/unFollow should return 400 if user tries to unfollow themselves", async () => {
    const logInResponse = await request(server)
      .post("/authentication/login")
      .send({ username: "test", password: "testingAccount" });

    const cookie = logInResponse.header["set-cookie"].pop();
    const response = await request(server)
      .delete("/following/unFollow")
      .send({ username: "test" })
      .set("Cookie", cookie);

    expect(response.status).toBe(400);
  });

  test("DELETE /following/unfollow should return 404 if user tries to unfollow a non-existent user", async () => {
    const loginResponse = await request(server)
      .post("/authentication/login")
      .send({
        username: "test",
        password: "testingAccount",
      });

    const cookie = loginResponse.header["set-cookie"];
    const response = await request(server)
      .delete("/following/unFollow")
      .send({ username: "test3" })
      .set("Cookie", cookie);

    expect(response.status).toBe(404);
  });
});
