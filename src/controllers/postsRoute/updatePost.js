const { db } = require("../../database/database");
const { validateChangedPost } = require("../validations/validateChangedPost")
const {ObjectId}= require("mongodb")

exports.updatePost = function (req, res) {

    const validatedBody = validateChangedPost(req.body)
    if (validatedBody.error) {
        res.status(400).send(validatedBody.error.details[0].message);
        return;
    }
    const { postText, id } = validatedBody.value;
    const { username } = req.loggedInUser;
  
     db.posts.updateOne({_id : new ObjectId(id), username},{$set:{postText}})
    .then(result=>{
        if(result.modifiedCount===1){
        res.status(200).send("Update complete")
        }else{
            throw new Error()
        }
    }) 
        .catch(error=>{
            res.status(500).send('Could not update post');
            return
        })
}