import { useEffect, useState } from "react";
import api from "../api/axiosUserClient";
import { useSearchParams } from "react-router-dom";

export default function CreateComment() {
  let [comments, setComments] = useState([]);
  let [commentText, setCommentText] = useState({ text: "" });
  let [activeReplyCommentId, setActiveReplyCommentId] = useState(null);
  let [replyTextByComment, setReplyTextByComment] = useState({});
  let [repliesByComment, setRepliesByComment] = useState({});
  let [openRepliesCommentId, setOpenRepliesCommentId] = useState(null);
  const [searchParams] = useSearchParams();
  const postId = searchParams.get("postId");
  console.log(postId);
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
  }, [postId]);

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

  async function getReplies(commentId) {
    let res = await api.get("/comment/showreply", {
      params: { commentId },
    });

    setRepliesByComment((prev) => ({
      ...prev,
      [commentId]: res.data,
    }));
  }

  async function deleteComment(commentId) {
    try {
      await api.delete(`/comment/delete/${commentId}`);
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <>
      {comments.map((c) => (
        <div key={c._id}>
          <p>{c.author?.username}</p>
          <p>{c.text}</p>
          <button
            onClick={() => {
              deleteComment(c._id);
            }}
          >
            Delete comment
          </button>
          {c.reply?.length > 0 && (
            <button
              onClick={() => {
                if (openRepliesCommentId === c._id) {
                  setOpenRepliesCommentId(null);
                  return;
                }

                setOpenRepliesCommentId(c._id);

                if (!repliesByComment[c._id]) {
                  getReplies(c._id);
                }
              }}
            >
              Show replies ({c.reply.length})
            </button>
          )}

          {openRepliesCommentId === c._id &&
            repliesByComment[c._id]?.map((r) => (
              <div key={r._id}>
                <p>{r.author?.username}</p>
                <p>{r.text}</p>
                <button
                  onClick={() => {
                    deleteComment(r._id);
                  }}
                >
                  Delete comment
                </button>
              </div>
            ))}

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
