import Post from "../Models/post.js";

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

async function deletePost(req, res) {
  let { _id } = req.body;
  const postToBeDeleted = await Post.findByIdAndDelete(_id);
  if (postToBeDeleted) {
    return res.status(500).json("Post deleted successfully");
  } else {
    return console.log("Post not found");
  }
}

async function getPost(req, res) {
  let posts = Post.find({});
  res.json([posts]);
}

export { createPost, deletePost, getPost };
