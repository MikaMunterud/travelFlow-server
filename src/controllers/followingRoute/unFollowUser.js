const { db } = require("../../database/database");
const { validateFollow } = require("../validations/validateFollow");
const { ObjectId } = require("mongodb");

exports.unFollowUser = async function (req, res) {
  const validatedBody = validateFollow(req.body);

  if (validatedBody.error) {
    res.status(400).send(validatedBody.error.details[0].message);
    return;
  }

  if (req.body._id !== req.loggedInUser.id) {
    try {
      const userToUnfollow = await db.users.findOne({
        _id: new ObjectId(req.body._id),
      });
      if (!userToUnfollow.followers.includes(req.loggedInUser.username)) {
        return res.status(403).json("You are not following this user");
      } else {
        await db.users.updateOne(
          { _id: new ObjectId(req.body._id) },
          { $pull: { followers: req.loggedInUser.username } }
        );
        await db.users.updateOne(
          { _id: new ObjectId(req.loggedInUser.id) },
          { $pull: { following: userToUnfollow.username } }
        );
        res.status(200).json("User has been unfollowed");
      }
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    return res.status(400).json("You can't unfollow yourself");
  }
};
