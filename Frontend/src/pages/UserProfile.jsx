import { useState, useEffect } from "react";
import api from "../api/axiosUserClient";
import { Heart, MessageCircle, Bookmark } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./UserProfile.css";

export default function UserProfile() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("userId");
  let [result, setResult] = useState(null);
  let [likeMap, setLikeMap] = useState({});
  let [saveMap, setSaveMap] = useState({});
  let [followMap, setFollowMap] = useState({});
  let [currentUserId, setCurrentUserId] = useState(null);
  let [likeCounts, setLikeCounts] = useState({});
  useEffect(() => {
    async function getUserProfile() {
      const meRes = await api.get("/userprofile/me/id");
      const meId = meRes.data.userId;
      setCurrentUserId(meId);

      let res = await api.get(`/userprofile/userprofile/${userId}`);
      const data = res.data;

      setResult(data);

      const followRes = await api.get("/userprofile/isfollowing", {
        params: { userid: data._id },
      });

      setFollowMap({
        [data._id]: followRes.data.following,
      });

      const counts = {};
      const likeStatus = {};
      const saveStatus = {};

      const posts = data.createdPosts || [];

      await Promise.all(
        posts.map(async (p) => {
          if (!p?._id) return;

          counts[p._id] = p.likesCount;

          const [likeRes, saveRes] = await Promise.all([
            api.get("/like/isliked", { params: { postId: p._id } }),
            api.get("/save/issaved", { params: { postId: p._id } }),
          ]);

          likeStatus[p._id] = likeRes.data.likedPost;
          saveStatus[p._id] = saveRes.data.userSavedPosts;
        }),
      );

      setLikeCounts(counts);
      setLikeMap(likeStatus);
      setSaveMap(saveStatus);
    }

    getUserProfile();
  }, [userId]);

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

  async function followUser(userid) {
    await api.post("/userprofile/increase/followers", { userid });

    setFollowMap((prev) => ({ ...prev, [userid]: true }));

    setResult((prev) => ({
      ...prev,
      followersCount: prev.followersCount + 1,
    }));
  }

  async function unfollowUser(userid) {
    await api.put("/userprofile/decrease/followers", { userid });

    setFollowMap((prev) => ({ ...prev, [userid]: false }));

    setResult((prev) => ({
      ...prev,
      followersCount: prev.followersCount - 1,
    }));
  }

  return (
    <>
      {result && (
        <div className="div">
          <img
            src={result.profilePic}
            width={200}
            height={200}
            alt="no profile image"
          />
          <p>{result.username}</p>
          <p>{result.bio}</p>
          <p>{result.createdPostsCount}</p>
          <p>posts</p>
          <p>{result.followersCount}</p>
          <p
            onClick={() => {
              result.followersCount === 0
                ? null
                : navigate({
                    pathname: "/userprofile/followers",
                    search: `?userId=${result._id}`,
                  });
            }}
          >
            followers
          </p>
          <p>{result.followingCount}</p>
          <p
            onClick={() => {
              result.followingCount === 0
                ? null
                : navigate({
                    pathname: "/userprofile/following",
                    search: `?userId=${result._id}`,
                  });
            }}
          >
            following
          </p>
          {currentUserId !== result._id && (
            <button
              className={`montserrat-text follow-btn ${
                followMap[result._id] ? "following" : ""
              }`}
              onClick={() =>
                followMap[result._id]
                  ? unfollowUser(result._id)
                  : followUser(result._id)
              }
            >
              {followMap[result._id] ? "Following" : "Follow"}
            </button>
          )}
          {result.createdPostsCount > 0 ? (
            <div>
              {result.createdPosts.map((post) => (
                <div key={post._id} className="profile-post-card">
                  <div className="profile-post-media">
                    {post.content.map((url, i) =>
                      post.resourceType[i] === "video" ? (
                        <video key={i} src={url} controls />
                      ) : (
                        <img key={i} src={url} alt="" />
                      ),
                    )}
                  </div>

                  <div className="profile-post-actions">
                    <button
                      className={`action-btn like-btn ${likeMap[post._id] ? "liked" : ""}`}
                      onClick={() => toggleLike(post._id)}
                      aria-label="Like post"
                    >
                      <Heart
                        fill={likeMap[post._id] ? "currentColor" : "none"}
                      />
                    </button>

                    <p className="like-count">
                      {likeCounts[post._id] ?? post.likesCount}
                    </p>

                    <button
                      className="action-btn comment-btn"
                      onClick={() =>
                        navigate({
                          pathname: "/comment",
                          search: `?postId=${post._id}`,
                        })
                      }
                      aria-label="Comment"
                    >
                      <MessageCircle />
                    </button>

                    <button
                      className={`action-btn bookmark-btn ${saveMap[post._id] ? "saved" : ""}`}
                      onClick={() => toggleSave(post._id)}
                      aria-label="Save post"
                    >
                      <Bookmark
                        fill={saveMap[post._id] ? "currentColor" : "none"}
                      />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div>
              <p>No posts created by this user</p>
            </div>
          )}
        </div>
      )}
    </>
  );
}
