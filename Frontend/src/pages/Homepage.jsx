import { useEffect, useState } from "react";
import api from "../api/axiosUserClient";
import { Heart, MessageCircle, Bookmark } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useInView } from "react-intersection-observer";

export default function Homepage() {
  const navigate = useNavigate();
  let [posts, setPosts] = useState([]);
  let [followMap, setFollowMap] = useState({});
  let [sortedPosts, setSortedPosts] = useState([]);

  // how many posts to show
  const [visibleCount, setVisibleCount] = useState(5);

  const { ref, inView } = useInView({
    rootMargin: "300px",
  });

  useEffect(() => {
    async function getPosts() {
      const postRes = await api.get("/post/find");
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

  useEffect(() => {
    const sorted = [...posts].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
    );

    setSortedPosts(sorted);
  }, [posts]);

  //the infinite scroll trigger
  useEffect(() => {
    if (!inView) return;

    if (visibleCount >= sortedPosts.length) return;

    setVisibleCount((prev) => prev + 5);
  }, [inView]);

  //follow user function
  async function followUser(userid) {
    await api.post("/userprofile/increase/followers", { userid });
    setFollowMap((prev) => ({ ...prev, [userid]: true }));
  }

  //unfollow user function
  async function unfollowUser(userid) {
    await api.put("/userprofile/decrease/followers", { userid });
    setFollowMap((prev) => ({ ...prev, [userid]: false }));
  }

  //like posts function
  async function likePost(postId) {
    api.post("/like/like", { postId });
    console.log("like button pushed");
  }

  //dislike posts function
  async function dislikePost(postId) {
    api.put("/like/dislike", { postId });
    console.log("dislike button pushed");
  }

  //this function checks if a post is liked by the user
  async function isliked(postId) {
    let res = await api.get("/like/isliked", {
      params: { postId: postId },
    });
    return res.data.likedPost;
  }

  //save post function
  async function savePost(postId) {
    try {
      await api.post("/save/save", { postId });
    } catch (err) {
      console.log(err.message);
    }
  }

  //unsave post function
  async function unsavePost(postId) {
    await api.put("/save/unsave", { postId });
  }

  //this function checks if a post is saved by the user
  async function isSaved(postId) {
    try {
      let res = await api.get("/save/issaved", {
        params: { postId: postId },
      });
      return res.data.userSavedPosts;
    } catch (err) {
      console.log(err.message);
    }
  }

  return (
    <>
      {sortedPosts?.slice(0, visibleCount).map((p) => (
        <div key={p._id}>
          <p
            onClick={() => {
              navigate({
                pathname: "/userprofile",
                search: `?userId=${p.user._id}`,
                replace: true,
              });
            }}
          >
            {p.user.username}
          </p>

          {followMap[p.user._id] ? (
            <button onClick={() => unfollowUser(p.user._id)}>Unfollow</button>
          ) : (
            <button onClick={() => followUser(p.user._id)}>Follow</button>
          )}
          {p.content.map((url, i) =>
            url.includes("video") ? (
              <video key={i} src={url} controls width="300" />
            ) : (
              <img key={i} src={url} width="300" />
            ),
          )}
          <p>{p.caption}</p>
          <button
            onClick={async () => {
              let result = await isliked(p._id);
              if (result) {
                dislikePost(p._id);
              } else {
                likePost(p._id);
              }
            }}
          >
            <Heart />
          </button>
          <button
            onClick={() => {
              navigate({
                pathname: "/comment",
                search: `?postId=${p._id}`,
                replace: true,
              });
            }}
          >
            <MessageCircle />
          </button>
          <button
            onClick={async () => {
              let result = await isSaved(p._id);
              if (result) {
                unsavePost(p._id);
              } else {
                savePost(p._id);
              }
            }}
          >
            <Bookmark />
          </button>
        </div>
      ))}

      <div ref={ref} style={{ height: 1 }} />
    </>
  );
}
