import { useEffect, useState } from "react";
import api from "../api/axiosUserClient";

export default function CreateComment({ postId }) {
  let [comments, setComments] = useState([]);
  let [commentText, setCommentText] = useState({ text: "" });
  let [activeReplyCommentId, setActiveReplyCommentId] = useState(null);
  let [replyTextByComment, setReplyTextByComment] = useState({});

  useEffect(() => {
    async function showComments() {
      let comment = await api.get("/comment/comments", {
        params: {
          postId: postId,
        },
      });
      setComments(comment.data);
    }
    showComments();
  }, []);

  async function createComment(e) {
    e.preventDefault();
    let text = commentText.text;
    await api.post("/comment/create", { postId: postId, text: text });
  }

  async function reply(e, commentId, postId) {
    e.preventDefault();
    let replyText = replyTextByComment[commentId];
    await api.post("/comment/reply", {
      commentId,
      replyText,
      postId,
    });
  }

  return (
    <>
      {comments.map((c) => (
        <div key={c._id}>
          <p>{c.text}</p>

          <p
            style={{ cursor: "pointer", color: "white" }}
            onClick={() =>
              setActiveReplyCommentId(
                activeReplyCommentId === c._id ? null : c._id,
              )
            }
          >
            Reply
          </p>

          {activeReplyCommentId === c._id && (
            <form
              onSubmit={(e) => {
                reply(e, c._id, c.post);
              }}
            >
              <input
                type="text"
                placeholder="write reply"
                value={replyTextByComment[c._id] || ""}
                onChange={(e) =>
                  setReplyTextByComment({
                    ...replyTextByComment,
                    [c._id]: e.target.value,
                  })
                }
              />

              <button type="submit">reply</button>
            </form>
          )}
        </div>
      ))}

      <form>
        <input
          name="text"
          type="text"
          placeholder="write comment"
          value={commentText.text}
          onChange={(e) =>
            setCommentText({ ...commentText, [e.target.name]: e.target.value })
          }
        />
        <button onClick={createComment}>Create comment</button>
      </form>
    </>
  );
}
