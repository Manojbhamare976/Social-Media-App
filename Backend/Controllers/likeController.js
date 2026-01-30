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

  let userLikedPost = user.likedPosts.inlcudes(post._id);
  if (!userLikedPost) {
    return console.log("user has not liked this post");
  } else {
    console.log("user has liked this post");
  }

  let postLikes = post.postLikes.inlcudes(user._id);
  if (!postLikes) {
    return console.log("user has not liked this post");
  } else {
    console.log("this post has been liked by a user");
  }

  user.likedPosts = user.likedPosts.filter(post._id);
  await user.save();

  post.likes = post.likes.filter(user._id);
  post.likesCount -= 1;
  await post.save();
}

export { like, dislike };
