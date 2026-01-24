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
    comment.save();
  } catch (err) {
    return res.json(err.message);
  }
}

export { createComment };
