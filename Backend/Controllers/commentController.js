import Comment from "../Models/comment.js";

async function createComment(req, res) {
  let { authorId, postId, text } = req.body;
  if (!text) {
    return res.status(404).json("Please create a comment");
  }

  let comment = new Comment({
    author: authorId,
    post: postId,
    text: text,
  });

  try {
    await comment.save();
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
  return comment;
}

export { createComment, deleteComment };
