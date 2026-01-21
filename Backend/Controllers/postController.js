import Post from "../Models/post";
import mongoose from "mongoose";

async function createPost(req, res) {
  let { user, caption, content } = req.body;
  let post = new Post({
    user: user,
    caption: caption,
    content: content,
  });
  await post
    .save()
    .then(console.log("post saved succesfully"))
    .catch((err) => {
      console.log(err);
    });
}

export { createPost };
