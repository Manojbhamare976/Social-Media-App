import Comment from "../Models/comment.js";
import Post from "../Models/post.js";

async function createComment(req, res) {
  let { userId } = req.user;
  let { postId, text } = req.body;
  if (!text) {
    return res.status(404).json("Please create a comment");
  }

  let comment = new Comment({
    author: userId,
    post: postId,
    text: text,
  });

  try {
    await comment.save();
    await Post.findByIdAndUpdate(postId, {
      $push: { comments: comment._id },
    });
    res.json("Comment saved successfully");
  } catch (err) {
    return res.json(err.message);
  }
}

async function deleteComment(req, res) {
  let { commentId } = req.body;
  let comment = await Comment.findById(commentId);
  if (!comment) {
    return res.status(404).json("Couldn't find comment");
  }
  if (comment.author == req.cookies.userId) {
    return await comment.deleteOne({});
  } else {
    return res.status(404).json("User not found");
  }
}

async function showComments(req, res) {
  let { postId } = req.query;
  let post = await Post.findById(postId).populate("comments");
  if (!post) {
    return res.status(400).json({ msg: "post not found" });
  }
  console.log(post.comments);
  return res.json(post.comments);
}

async function reply(req, res) {
  let { userId } = req.user;
  let { commentId, replyText, postId } = req.body;

  let comment = await Comment.findById(commentId);
  let reply = new Comment({
    author: userId,
    post: postId,
    text: replyText,
  });

  comment.reply.push(reply);
  await comment.save();
}

export { createComment, deleteComment, showComments, reply };
