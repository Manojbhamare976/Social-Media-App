import { useEffect, useState } from "react";
import api from "../api/axiosUserClient";

export default function CreateComment({ postId }) {
  let [comments, setComments] = useState([]);
  let [commentText, setCommentText] = useState({ text: "" });

  useEffect(() => {
    async function showComments() {
      let comment = await api.get("/comment/comments", {
        params: {
          postId: postId,
        },
      });
      console.log(comment.data);
      console.log(comment.data.map((c) => c.text));
      // let data = comment.data.map((c) => c.text);
      setComments(comment.data);
    }
    showComments();
  }, []);

  async function createComment(e) {
    e.preventDefault();
    let text = commentText.text;
    await api.post("/comment/create", { postId: postId, text: text });
  }

  return (
    <>
      {comments?.map((c) => (
        <p key={c._id}>{c.text}</p>
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
