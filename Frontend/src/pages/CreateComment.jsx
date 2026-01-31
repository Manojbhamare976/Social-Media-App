import { useEffect, useState } from "react";
import api from "../api/axiosUserClient";

export default function CreateComment({ postId }) {
  let [comments, setComments] = useState([]);

  useEffect(() => {
    async function showComments() {
      let comment = await api.get("/comment/comments", {
        params: {
          postId: postId,
        },
      });
      console.log(comment);
      setComments([...comments, comment]);
    }
    showComments();
  }, []);

  return (
    <>
      {comments?.map((c) => {
        <div>{c}</div>;
      })}

      <form>
        <input placeholder="write comment"></input>
      </form>
    </>
  );
}
