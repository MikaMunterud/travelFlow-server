const { db } = require("../../database/database");
const { validateFollow } = require("../validations/validateFollow");

exports.unFollowUser = async function (req, res) {
  const validatedUsername = validateFollow(req.body);

  if (validatedUsername.error) {
    res.status(400).send(validatedUsername.error.details[0].message);
    return;
  }
  const loggedInUser = req.loggedInUser.username;
  const unFollowUsername = req.body.username;

  if (unFollowUsername === loggedInUser) {
    return res.status(400).json("You cannot follow yourself");
  }

  try {
    const userToUnfollow = await db.users.findOne({
      username: unFollowUsername,
    });

    if (!userToUnfollow) {
      return res.status(404).json("User not found");
    }

    if (!userToUnfollow.followers.includes(loggedInUser)) {
      return res.status(403).json("You are not following this user");
    }

    const update = [
      {
        updateOne: {
          filter: { username: unFollowUsername },
          update: { $pull: { followers: loggedInUser } },
        },
      },
      {
        updateOne: {
          filter: { username: loggedInUser },
          update: { $pull: { following: unFollowUsername } },
        },
      },
    ];

    const result = await db.users.bulkWrite(update);

    if (result.modifiedCount === 0) {
      return res.status(404).json("User not found");
    }

    return res.status(200).json("User has been unfollowed");
  } catch (err) {
    return res.status(500).json(err.message);
  }
};
