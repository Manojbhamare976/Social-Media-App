import User from "../Models/user.js";
import Post from "../Models/post.js";

async function like(req, res) {
  let { userId } = req.user;
  let { postId } = req.body;

  console.log(`userId = ${userId}`);
  console.log(`postId = ${postId}`);

  let user = await User.findById(userId);
  let post = await Post.findById(postId);

  if (!user) {
    return console.log("userId not found");
  } else if (!post) {
    return console.log("postId not found");
  }
  try {
    post.likes.push(user._id);
    post.likesCount += 1;
    await post.save();

    user.likedPosts.push(post._id);
    await user.save();
  } catch (err) {
    console.log(err);
  }
}

async function dislike(req, res) {
  let { userId } = req.user;
  let { postId } = req.body;

  let user = await User.findById(userId);
  let post = await Post.findById(postId);

  if (!user) {
    return console.log("userId not found");
  } else if (!post) {
    return console.log("postId not found");
  }

  let userLikedPost = user.likedPosts.includes(post._id);
  if (!userLikedPost) {
    console.log("user has not liked this post");
    return;
  } else {
    console.log("user has liked this post");
  }

  let postLikes = post.likes.includes(user._id);
  if (!postLikes) {
    console.log("user has not liked this post");
    return;
  } else {
    console.log("this post has been liked by a user");
  }

  user.likedPosts = user.likedPosts.filter((id) => id.toString() !== postId);
  console.log(user.likedPosts);
  await user.save();

  post.likes = post.likes.filter((id) => id.toString() !== userId);
  post.likesCount -= 1;
  console.log(post.likes);
  await post.save();
}

async function isLiked(req, res) {
  let { userId } = req.user;
  let { postId } = req.query;

  let user = await User.findById(userId);
  let post = await Post.findById(postId);

  if (!user) {
    return res.json({ msg: "user not found" });
  } else if (!post) {
    return res.json({ msg: "post not found" });
  }

  let likedPost = user.likedPosts.includes(post._id);
  return res.json({ likedPost });
}

export { like, dislike, isLiked };
