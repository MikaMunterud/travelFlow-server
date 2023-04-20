const { db } = require("../../database/database");

exports.getAllUsers = async function (request, response) {
  try {
    const result = await db.users.find().toArray();

    const users = result.map((user) => {
      delete user.password;
      return user;
    });

    if (!Array.isArray(users)) {
      return response
        .status(500)
        .json({ error: "Internal server error: could not retrieve users" });
    }

    if (users.length === 0) {
      return response.status(404).json({ error: "No users where found" });
    }

    response
      .status(200)
      .json({ users, message: "Successfully retrieved all users" });
  } catch (err) {
    console.log(err);
    response
      .status(500)
      .json({ error: "Internal server error: could not retrieve users" });
  }
};
