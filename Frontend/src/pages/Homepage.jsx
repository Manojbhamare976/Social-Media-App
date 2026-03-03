import { useEffect, useState } from "react";
import { getHomeCache, setHomeCache, clearHomeCache } from "../cache/homeCache";
import api from "../api/axiosUserClient";
import { Heart, MessageCircle, Bookmark } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useInView } from "react-intersection-observer";
import "./Homepage.css";

export default function Homepage() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [followMap, setFollowMap] = useState({});
  const [sortedPosts, setSortedPosts] = useState([]);
  const [likeMap, setLikeMap] = useState({});
  const [saveMap, setSaveMap] = useState({});
  const [likeCounts, setLikeCounts] = useState({});
  const [visibleCount, setVisibleCount] = useState(5);
  const [isRestoring, setIsRestoring] = useState(false);

  const { ref, inView } = useInView({ rootMargin: "300px" });

  useEffect(() => {
    const cached = getHomeCache();

    if (cached && cached.posts && cached.posts.length > 0) {
      setIsRestoring(true);

      setPosts(cached.posts);
      setFollowMap(cached.followMap);
      setLikeMap(cached.likeMap);
      setSaveMap(cached.saveMap);
      setLikeCounts(cached.likeCounts);
      setVisibleCount(cached.visibleCount);

      requestAnimationFrame(() => {
        window.scrollTo(0, cached.scrollY || 0);

        // allow infinite scroll again AFTER restore
        setTimeout(() => {
          setIsRestoring(false);
        }, 0);
      });

      return;
    }

    async function getPosts() {
      const postRes = await api.get("/post/find");
      const fetchedPosts = postRes.data;

      setPosts(fetchedPosts);

      const counts = {};
      fetchedPosts.forEach((p) => {
        counts[p._id] = p.likesCount;
      });
      setLikeCounts(counts);

      fetchedPosts.forEach(async (p) => {
        const followRes = await api.get("/userprofile/isfollowing", {
          params: { userid: p.user._id },
        });

        const likeRes = await api.get("/like/isliked", {
          params: { postId: p._id },
        });

        const saveRes = await api.get("/save/issaved", {
          params: { postId: p._id },
        });

        setFollowMap((prev) => ({
          ...prev,
          [p.user._id]: followRes.data.following,
        }));

        setLikeMap((prev) => ({
          ...prev,
          [p._id]: likeRes.data.likedPost,
        }));

        setSaveMap((prev) => ({
          ...prev,
          [p._id]: saveRes.data.userSavedPosts,
        }));
      });
    }

    getPosts();
  }, []);

  useEffect(() => {
    if (posts.length === 0) return;

    setHomeCache({
      posts,
      followMap,
      likeMap,
      saveMap,
      likeCounts,
      visibleCount,
      scrollY: window.scrollY,
    });
  }, [posts, followMap, likeMap, saveMap, likeCounts, visibleCount]);

  useEffect(() => {
    if (posts.length === 0) return;

    const onScroll = () => {
      const cached = getHomeCache();

      if (!cached || !cached.posts || cached.posts.length === 0) return;

      setHomeCache({
        ...cached,
        scrollY: window.scrollY,
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [posts]);

  useEffect(() => {
    setSortedPosts(
      [...posts].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
    );
  }, [posts]);

  useEffect(() => {
    if (isRestoring) return;
    if (!inView || visibleCount >= sortedPosts.length) return;

    setVisibleCount((prev) => prev + 5);
  }, [inView, isRestoring]);

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    return () => {
      if ("scrollRestoration" in window.history) {
        window.history.scrollRestoration = "auto";
      }
    };
  }, []);

  async function followUser(userid) {
    await api.post("/userprofile/increase/followers", { userid });
    setFollowMap((prev) => ({ ...prev, [userid]: true }));
  }

  async function unfollowUser(userid) {
    await api.put("/userprofile/decrease/followers", { userid });
    setFollowMap((prev) => ({ ...prev, [userid]: false }));
  }

  async function toggleLike(postId) {
    const alreadyLiked = likeMap[postId];

    setLikeMap((prev) => ({ ...prev, [postId]: !alreadyLiked }));
    setLikeCounts((prev) => ({
      ...prev,
      [postId]: prev[postId] + (alreadyLiked ? -1 : 1),
    }));

    try {
      if (alreadyLiked) {
        await api.put("/like/dislike", { postId });
      } else {
        await api.post("/like/like", { postId });
      }
    } catch {
      setLikeMap((prev) => ({ ...prev, [postId]: alreadyLiked }));
      setLikeCounts((prev) => ({
        ...prev,
        [postId]: prev[postId] + (alreadyLiked ? 1 : -1),
      }));
    }
  }

  async function toggleSave(postId) {
    const alreadySaved = saveMap[postId];

    setSaveMap((prev) => ({ ...prev, [postId]: !alreadySaved }));

    try {
      if (alreadySaved) {
        await api.put("/save/unsave", { postId });
      } else {
        await api.post("/save/save", { postId });
      }
    } catch {
      setSaveMap((prev) => ({ ...prev, [postId]: alreadySaved }));
    }
  }

  return (
    <div className="homepage-layout">
      {sortedPosts?.slice(0, visibleCount).map((p) => (
        <div key={p._id} className="posts">
          <div className="user-details">
            <img
              src={p.user.profilePic}
              width={50}
              height={50}
              alt="profile"
              className="profile-pic"
              onClick={() =>
                navigate({
                  pathname: "/userprofile",
                  search: `?userId=${p.user._id}`,
                })
              }
            />
            <p
              className="montserrat-text username-link"
              onClick={() =>
                navigate({
                  pathname: "/userprofile",
                  search: `?userId=${p.user._id}`,
                })
              }
            >
              {p.user.username}
            </p>
            <button
              className={`montserrat-text follow-btn ${followMap[p.user._id] ? "following" : ""}`}
              onClick={() =>
                followMap[p.user._id]
                  ? unfollowUser(p.user._id)
                  : followUser(p.user._id)
              }
            >
              {followMap[p.user._id] ? "Following" : "Follow"}
            </button>
          </div>

          {p.content.map((url, i) =>
            url.includes("video") ? (
              <video key={i} src={url} controls width="300" />
            ) : (
              <img key={i} src={url} width="300" alt="post content" />
            ),
          )}

          <p className="caption poppins-medium">{p.caption}</p>

          <div className="post-buttons">
            <button
              className={`action-btn like-btn ${likeMap[p._id] ? "liked" : ""}`}
              onClick={() => toggleLike(p._id)}
              aria-label="Like post"
            >
              <Heart fill={likeMap[p._id] ? "currentColor" : "none"} />
            </button>
            <p className="poppins-medium like-count">
              {likeCounts[p._id] ?? p.likesCount}
            </p>

            <button
              className="action-btn comment-btn"
              onClick={() =>
                navigate({ pathname: "/comment", search: `?postId=${p._id}` })
              }
              aria-label="Comment"
            >
              <MessageCircle />
            </button>

            <button
              className={`action-btn bookmark-btn ${saveMap[p._id] ? "saved" : ""}`}
              onClick={() => toggleSave(p._id)}
              aria-label="Save post"
            >
              <Bookmark fill={saveMap[p._id] ? "currentColor" : "none"} />
            </button>
          </div>
        </div>
      ))}
      <div ref={ref} style={{ height: 1 }} />
    </div>
  );
}
