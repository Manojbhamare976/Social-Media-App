import User from "../Models/user.js";
import Post from "../Models/post.js";

async function savePost(req, res) {
  let { userId } = req.user;
  let { postId } = req.body;
  try {
    let user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ msg: "user not found" });
    }
    user.savedPosts.push(postId);
    await user.save().then(() => {
      console.log("post saved successfully");
    });
  } catch (err) {
    console.log(err.message);
  }
}

async function unsavePost(req, res) {
  try {
    let { userId } = req.user;
    let { postId } = req.body;

    let user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ msg: "user not found" });
    }
    let userSavedPosts = user.savedPosts.includes(postId);
    if (!userSavedPosts) {
      return res.status(400).json({ msg: "user hasn't saved this post" });
    }
    user.savedPosts = await user.savedPosts.filter((id) => {
      id !== postId;
    });
    await user.save();
  } catch (err) {
    console.log(err.message);
  }
}

async function isSaved(req, res) {
  let { userId } = req.user;
  let { postId } = req.query;

  let user = await User.findById(userId);
  if (!user) {
    return res.status(400).json({ msg: "user not found" });
  }

  let userSavedPosts = user.savedPosts.includes(postId);
  console.log(`userSavedPosts = ${userSavedPosts}`);
  if (!userSavedPosts) {
    return res.json({ userSavedPosts });
  }
  return res.json({ userSavedPosts });
}

export { savePost, unsavePost, isSaved };
