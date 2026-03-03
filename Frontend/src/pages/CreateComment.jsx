import { useEffect, useState } from "react";
import api from "../api/axiosUserClient";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Heart, EllipsisVertical } from "lucide-react";
import "./CreateComment.css";

export default function CreateComment() {
  const navigate = useNavigate();

  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState({ text: "" });

  const [activeReplyCommentId, setActiveReplyCommentId] = useState(null);
  const [replyTextByComment, setReplyTextByComment] = useState({});
  const [repliesByComment, setRepliesByComment] = useState({});
  const [openRepliesCommentId, setOpenRepliesCommentId] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);

  // used for BOTH comments & replies
  const [likedMap, setLikedMap] = useState({});

  const [openMenuId, setOpenMenuId] = useState(null);

  const [searchParams] = useSearchParams();
  const postId = searchParams.get("postId");

  useEffect(() => {
    async function fetchCurrentUserId() {
      const res = await api.get("/userprofile/me/id");
      setCurrentUserId(res.data.userId);
    }

    fetchCurrentUserId();
  }, []);

  useEffect(() => {
    fetchComments();
  }, [postId]);

  async function fetchComments() {
    const res = await api.get("/comment/comments", {
      params: { postId },
    });

    const sorted = [...res.data].sort(
      (a, b) => (b.likesCount || 0) - (a.likesCount || 0),
    );

    setComments(sorted);
  }

  async function createComment(e) {
    e.preventDefault();

    await api.post("/comment/create", {
      postId,
      text: commentText.text,
    });

    setCommentText({ text: "" });
    fetchComments();
  }

  async function reply(e, commentId, postId) {
    e.preventDefault();

    await api.post("/comment/reply", {
      commentId,
      replyText: replyTextByComment[commentId],
      postId,
    });

    setReplyTextByComment((p) => ({ ...p, [commentId]: "" }));

    // update replies list
    await getReplies(commentId);

    // update reply count instantly
    setComments((prev) =>
      prev.map((c) =>
        c._id === commentId ? { ...c, reply: [...(c.reply || []), "tmp"] } : c,
      ),
    );
  }

  async function getReplies(commentId) {
    const res = await api.get("/comment/showreply", {
      params: { commentId },
    });

    setRepliesByComment((prev) => ({
      ...prev,
      [commentId]: res.data,
    }));
  }

  async function deleteComment(commentId) {
    await api.delete(`/comment/delete/${commentId}`);

    setComments((prev) => prev.filter((c) => c._id !== commentId));
    setOpenMenuId(null);
  }

  async function deleteReply(parentCommentId, replyId) {
    await api.delete(`/comment/delete/${replyId}`);

    setRepliesByComment((prev) => ({
      ...prev,
      [parentCommentId]: prev[parentCommentId].filter((r) => r._id !== replyId),
    }));

    setComments((prev) =>
      prev.map((c) =>
        c._id === parentCommentId ? { ...c, reply: c.reply.slice(0, -1) } : c,
      ),
    );

    setOpenMenuId(null);
  }

  async function toggleLike(targetId, isReply = false, parentCommentId = null) {
    const alreadyLiked = likedMap[targetId];

    setLikedMap((p) => ({ ...p, [targetId]: !alreadyLiked }));

    if (!isReply) {
      setComments((prev) =>
        [...prev]
          .map((c) =>
            c._id === targetId
              ? {
                  ...c,
                  likesCount: (c.likesCount || 0) + (alreadyLiked ? -1 : 1),
                }
              : c,
          )
          .sort((a, b) => (b.likesCount || 0) - (a.likesCount || 0)),
      );
    } else {
      setRepliesByComment((prev) => ({
        ...prev,
        [parentCommentId]: prev[parentCommentId].map((r) =>
          r._id === targetId
            ? {
                ...r,
                likesCount: (r.likesCount || 0) + (alreadyLiked ? -1 : 1),
              }
            : r,
        ),
      }));
    }

    try {
      if (alreadyLiked) {
        await api.put("/comment/dislikecomment", { commentId: targetId });
      } else {
        await api.post("/comment/likecomment", { commentId: targetId });
      }
    } catch (err) {
      setLikedMap((p) => ({ ...p, [targetId]: alreadyLiked }));
    }
  }

  function goToProfile(userId) {
    navigate({
      pathname: "/userprofile",
      search: `?userId=${userId}`,
      replace: true,
    });
  }

  return (
    <div className="comment-page">
      <div className="comment-list">
        {comments.length === 0 && (
          <div className="no-comments">
            <div className="no-comments-title">No comments yet.</div>
            <div className="no-comments-subtitle">Start the conversation.</div>
          </div>
        )}
        {comments.map((c) => (
          <div key={c._id} className="comment-card">
            <div className="comment-main">
              <div className="comment-header">
                <div
                  className="comment-user"
                  onClick={() => goToProfile(c.author?._id)}
                >
                  <img src={c.author?.profilePic} alt="" />
                  <span>{c.author?.username}</span>
                </div>

                <div className="comment-right">
                  {currentUserId === c.author?._id && (
                    <div className="comment-menu-wrapper">
                      <EllipsisVertical
                        className="comment-menu-icon"
                        size={18}
                        onClick={() =>
                          setOpenMenuId(openMenuId === c._id ? null : c._id)
                        }
                      />

                      {openMenuId === c._id && (
                        <div className="comment-dropdown">
                          <button onClick={() => deleteComment(c._id)}>
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  <button
                    className={`comment-like-btn ${
                      likedMap[c._id] ? "liked" : ""
                    }`}
                    onClick={() => toggleLike(c._id)}
                  >
                    <Heart
                      size={18}
                      fill={likedMap[c._id] ? "currentColor" : "none"}
                    />
                  </button>

                  <span className="comment-like-count">
                    {c.likesCount || 0}
                  </span>
                </div>
              </div>

              <p className="comment-text">{c.text}</p>

              <div className="comment-actions">
                <span
                  onClick={() =>
                    setActiveReplyCommentId(
                      activeReplyCommentId === c._id ? null : c._id,
                    )
                  }
                >
                  Reply
                </span>

                {(c.reply?.length || 0) > 0 && (
                  <span
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
                    View replies ({c.reply.length})
                  </span>
                )}
              </div>

              {activeReplyCommentId === c._id && (
                <form
                  className="reply-form"
                  onSubmit={(e) => reply(e, c._id, c.post)}
                >
                  <input
                    type="text"
                    placeholder="Write a reply…"
                    value={replyTextByComment[c._id] || ""}
                    onChange={(e) =>
                      setReplyTextByComment({
                        ...replyTextByComment,
                        [c._id]: e.target.value,
                      })
                    }
                  />
                  <button type="submit">Post</button>
                </form>
              )}

              {openRepliesCommentId === c._id &&
                repliesByComment[c._id]?.map((r) => (
                  <div key={r._id} className="reply-card">
                    <div
                      className="reply-user-block"
                      onClick={() => goToProfile(r.author?._id)}
                    >
                      <img
                        src={r.author?.profilePic}
                        className="reply-avatar"
                        alt=""
                      />
                      <span className="reply-user">{r.author?.username}</span>
                    </div>

                    <span className="reply-text">{r.text}</span>

                    <div className="reply-right">
                      {currentUserId === r.author?._id && (
                        <div className="comment-menu-wrapper">
                          <EllipsisVertical
                            size={16}
                            className="comment-menu-icon"
                            onClick={() =>
                              setOpenMenuId(openMenuId === r._id ? null : r._id)
                            }
                          />

                          {openMenuId === r._id && (
                            <div className="comment-dropdown">
                              <button onClick={() => deleteReply(c._id, r._id)}>
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                      )}

                      <button
                        className={`comment-like-btn ${
                          likedMap[r._id] ? "liked" : ""
                        }`}
                        onClick={() => toggleLike(r._id, true, c._id)}
                      >
                        <Heart
                          size={16}
                          fill={likedMap[r._id] ? "currentColor" : "none"}
                        />
                      </button>

                      <span className="comment-like-count">
                        {r.likesCount || 0}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>

      <form className="comment-create-form" onSubmit={createComment}>
        <input
          name="text"
          type="text"
          placeholder="Write a comment…"
          value={commentText.text}
          onChange={(e) =>
            setCommentText({
              ...commentText,
              [e.target.name]: e.target.value,
            })
          }
        />
        <button type="submit">Post</button>
      </form>
    </div>
  );
}
