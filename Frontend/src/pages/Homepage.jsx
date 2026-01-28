import { useEffect, useState } from "react";
import api from "../api/axiosUserClient";
import { Heart, MessageCircle, Share, Bookmark } from "lucide-react";

export default function Homepage() {
  let [posts, setPosts] = useState([]);

  useEffect(() => {
    async function getPosts() {
      const post = await api.get("/post/find");
      console.log(post);
      setPosts(post.data);
    }
    getPosts();
  }, []);

  async function incFollowers(userid) {
    try {
      api.post("/userprofile/increase/followers", { userid: userid });
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <>
      {posts?.map((p) => (
        <div key={p._id}>
          <p>{p.user.username}</p>
          <button
            onClick={() => {
              incFollowers(p.user._id);
            }}
          >
            Follow
          </button>
          <p>{p.content}</p>
          <Heart />
          <MessageCircle />
          <Share />
          <Bookmark />
        </div>
      ))}
    </>
  );
}
