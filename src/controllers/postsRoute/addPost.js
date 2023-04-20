const { db } = require("../../database/database");
const { validateNewPost } = require("../validations/validateNewPost")

exports.addPost = function (req, res) {

    const validatedBody = validateNewPost(req.body)
    if (validatedBody.error) {
        res.status(400).send(validatedBody.error.details[0].message);
        return;
    }
    const { postText } = validatedBody.value;
    const newPost = {
        username: req.loggedInUser.username,
        postText,
        likes: [],
        comments: [],
         creation: new Date()
    }
    db.posts.insertOne(newPost)
        .then(result => {
            if(result.insertedId){
            res.status(200).send('Post inserted')
            }else{
                throw new Error('Could not insert post')
            }
        })
        .catch(error=>{
            res.status(500).send('Ooops, something went wrong');
            return
        })
}

