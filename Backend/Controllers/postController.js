import Post from "../Models/post.js";
import User from "../Models/user.js";

async function createPost(req, res) {
  try {
    let { userId } = req.user;
    let { caption } = req.body;

    let user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ msg: "user not found" });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json("Please upload image or video");
    }

    const content = req.files.map((file) => file.path);
    const publicId = req.files.map((file) => file.filename);

    let post = new Post({
      user: userId,
      caption: caption,
      content: content, // only URLs
      publicId: publicId, //public id
    });

    await post.save();

    user.createdPosts.push(post._id);
    user.createdPostsCount += 1;

    await user.save();

    console.log("post saved successfully");
    res.json(post);
  } catch (err) {
    console.log(err);
    res.status(500).json("Post creation failed");
  }
}

async function deletePost(req, res) {
  let { _id } = req.body;
  const postToBeDeleted = await Post.findByIdAndDelete(_id);
  if (postToBeDeleted) {
    return res.status(200).json("Post deleted successfully");
  } else {
    return console.log("Post not found");
  }
}

async function getPost(req, res) {
  try {
    let post = await Post.find({}).populate("user", "username");
    res.json(post);
  } catch (err) {
    console.log(err.message);
  }
}

export { createPost, deletePost, getPost };
