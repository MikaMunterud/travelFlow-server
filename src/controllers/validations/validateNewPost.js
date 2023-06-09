const joi = require("joi");

exports.validateNewPost = function (requestBody) {
  const postSchema = joi.object({
    postText: joi.string().min(3).max(500).required(),
  });

  return postSchema.validate(requestBody);
};


