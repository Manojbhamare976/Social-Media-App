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
  const { userId } = req.user;
  const { commentId } = req.params;

  try {
    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json("Couldn't find comment");
    }

    if (comment.author.toString() !== userId) {
      return res.status(403).json("Not authorized");
    }

    //Remove the comment from any parent reply array
    await Comment.updateMany(
      { reply: commentId },
      { $pull: { reply: commentId } },
    );

    //If this comment has replies, delete them
    if (comment.reply.length > 0) {
      await Comment.deleteMany({
        _id: { $in: comment.reply },
      });
    }

    //Delete the comment itself
    await Comment.findByIdAndDelete(commentId);

    return res.json({ msg: "comment deleted successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json(err.message);
  }
}

async function showComments(req, res) {
  let { postId } = req.query;
  let post = await Post.findById(postId).populate({
    path: "comments",
    populate: { path: "author" },
  });
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

    let comment = await Comment.findById(commentId).populate({
      path: "reply",
      populate: {
        path: "author",
      },
    });

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
