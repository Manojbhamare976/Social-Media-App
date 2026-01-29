import { useEffect, useState } from "react";
import api from "../api/axiosUserClient";
import { Heart, MessageCircle, Share, Bookmark } from "lucide-react";

export default function Homepage() {
  let [posts, setPosts] = useState([]);
  let [followMap, setFollowMap] = useState({});

  useEffect(() => {
    async function getPosts() {
      const postRes = await api.get("/post/find");
      console.log(postRes);
      setPosts(postRes.data);

      // check follow status for each post user
      postRes.data.forEach(async (p) => {
        const res = await api.get("/userprofile/isfollowing", {
          params: { userid: p.user._id },
        });

        setFollowMap((prev) => ({
          ...prev,
          [p.user._id]: res.data.following,
        }));
      });
    }
    getPosts();
  }, []);

  //follow user function
  async function followUser(userid) {
    await api.post("/userprofile/increase/followers", { userid });
    setFollowMap((prev) => ({ ...prev, [userid]: true }));
  }

  async function unfollowUser(userid) {
    await api.put("/userprofile/decrease/followers", { userid });
    setFollowMap((prev) => ({ ...prev, [userid]: false }));
  }

  //like posts function
  async function likePost(postId) {
    api.post("/like/like", { postId });
    console.log("like button pushed");
  }

  return (
    <>
      {posts?.map((p) => (
        <div key={p._id}>
          <p>{p.user.username}</p>

          {followMap[p.user._id] ? (
            <button onClick={() => unfollowUser(p.user._id)}>Unfollow</button>
          ) : (
            <button onClick={() => followUser(p.user._id)}>Follow</button>
          )}
          <p>{p.content}</p>
          <button
            onClick={() => {
              likePost(p._id);
            }}
          >
            <Heart />
          </button>
          <MessageCircle />
          <Share />
          <Bookmark />
        </div>
      ))}
    </>
  );
}
