const request = require("supertest");
const { db } = require("../../src/database/database")
const { server } = require("../../src/server/server")

let cookie = undefined

beforeAll(async () => {
  await db.connect();
  const resReg = await request(server).post("/authentication/register").send({ username: "TestLama", password: "Testsson" })
  if (resReg.status == 201) {
    const resLog = await request(server).post("/authentication/login").send({ username: "TestLama", password: "Testsson" })
    console.log(resLog.header['set-cookie'])
    cookie = resLog.header['set-cookie']
  }
})

afterAll(async () => {
  try {
    await db.posts.deleteMany({ username: "TestLama" })
    await db.users.deleteOne({ username: "TestLama" })
  } catch (error) {
    console.log(error)
  } finally {
    await db.disconnect()
  }
})

describe("Testing that add and update post return expected results", () => {

  test("Adds post and recieves status 200 with expected contents when correct body is sent", async () => {
    const resPost = await request(server).post("/posts/add").set('Cookie', cookie).send({ postText: "Solen lyser på test 1" })
    expect(resPost.status).toBe(200)
    expect(resPost).toHaveProperty("text")
    expect(resPost.text).toBe("Post inserted")
  })

  test("Adds post and recieves status 400 with expected contents when incorrect body is sent", async () => {
    const resPost = await request(server).post("/posts/add").set('Cookie', cookie).send({ postFext: "Solen lyser på test 1" })
    expect(resPost.status).toBe(400)
    expect(resPost).toHaveProperty("text")
    expect(resPost.text).toBe('"postText" is required')
  });

  test("Adds post and recieves status 400 with expected contents when incorrect body is sent", async () => {
    const resPost = await request(server).post("/posts/add").set('Cookie', cookie).send({ postText: 1 })
    console.log(resPost.text)
    expect(resPost.status).toBe(400)
    expect(resPost).toHaveProperty("text")
    expect(resPost.text).toBe('"postText" must be a string')
  });
  1
});
