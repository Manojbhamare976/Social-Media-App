import Post from "../Models/post";

async function createPost(req, res) {
  let { user, caption, content } = req.body;
  let post = new Post({
    user: user,
    caption: caption,
    content: content,
  });
  try {
    await post.save().then(console.log("post saved succesfully"));
    res.json(post);
  } catch (err) {
    console.log(err);
  }
}

export { createPost };
