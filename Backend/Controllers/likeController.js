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

export { like };
