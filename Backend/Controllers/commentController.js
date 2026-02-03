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
  let { userId } = req.user;
  let { commentId } = req.params;
  let comment = await Comment.findById(commentId);
  if (!comment) {
    return res.status(404).json("Couldn't find comment");
  }

  if (comment.author == userId) {
    if (comment.reply.length > 0) {
      comment.reply.map(async (id) => {
        await Comment.findByIdAndDelete(id);
      });
    }

    await Comment.updateMany(
      { reply: commentId },
      { $pull: { reply: commentId } },
    );

    await comment.deleteOne({});
    res.json({ msg: "comment deleted succesfully" });
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
  await reply.save();
  comment.reply.push(reply._id);
  await comment.save();
  return res.json({ msg: "Reply created" });
}

async function showReply(req, res) {
  try {
    let { commentId } = req.query;

    let comment = await Comment.findById(commentId).populate("reply");

    if (!comment) {
      return res.status(404).json({ msg: "comment not found" });
    }

    return res.json(comment.reply);
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ msg: err.message });
  }
}

export { createComment, deleteComment, showComments, reply, showReply };
