import { useEffect, useState } from "react";
import api from "../api/axiosUserClient";
import { Heart, MessageCircle, Share, Bookmark } from "lucide-react";

export default function Homepage() {
  let [posts, setPosts] = useState([]);

  useEffect(() => {
    async function getPosts() {
      const post = await api.get("/post/find");

      const allContents = post.data.flatMap((d) => d.content);

      setPosts(allContents);
    }

    getPosts();
  }, []);

  return (
    <>
      {posts?.map((p) => (
        <div>
          <p>{p}</p>
          <Heart />
          <MessageCircle />
          <Share />
          <Bookmark />
        </div>
      ))}
    </>
  );
}
