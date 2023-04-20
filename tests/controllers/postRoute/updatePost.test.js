const request = require("supertest");
const { db } = require("../../../src/database/database")
const { server } = require("../../../src/server/server")

let cookie = undefined
let postId = undefined

beforeAll(async () => {
  await db.connect();
  const resReg = await request(server).post("/authentication/register").send({ username: "TestLama2", password: "Testsson" })
  if (resReg.status == 201) {
    const resLog = await request(server).post("/authentication/login").send({ username: "TestLama2", password: "Testsson" })
    cookie = resLog.header['set-cookie']
    await request(server).post("/posts/add").set('Cookie', resLog.header['set-cookie']).send({ postText: "Solen lyser på test 2" })
    const getPost = await request(server).get("/posts/TestLama2").set('Cookie', cookie)
    postId = getPost.body[0]._id
  }
})

afterAll(async () => {
  try {
    await db.posts.deleteMany({ username: "TestLama2" })
    await db.users.deleteOne({ username: "TestLama2" })
  } catch (error) {
  } finally {
    await db.disconnect()
  }
})

describe("Testing that updatepost return expected results", () => {

  test("Fetches testpost, stores id and updates text in the post", async () => {
    const resUpdatePost = await request(server).patch("/posts").set('Cookie', cookie).send({ id: postId, postText: "Solen lyser på ändringen av test 2" })
    expect(resUpdatePost.status).toBe(200)
    expect(resUpdatePost).toHaveProperty("text")
    expect(resUpdatePost.text).toBe('Update complete')
  });

  test("Updatepost and recieves status 400 with expected contents when incorrect body is sent", async () => {
    const resUpdatePost = await request(server).patch("/posts").set('Cookie', cookie).send({ postText: "Solen lyser på ändringen av test 2" })
    expect(resUpdatePost.status).toBe(400)
    expect(resUpdatePost).toHaveProperty("text")
    expect(resUpdatePost.text).toBe('"id" is required')
  });

});
