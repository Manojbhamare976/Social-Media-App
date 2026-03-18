import { useState, useEffect } from "react";
import api from "../api/axiosUserClient";
import { Heart, MessageCircle, Bookmark, EllipsisVertical } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./Profilepage.css";
export default function Userprofile() {
  const navigate = useNavigate();
  let [result, setResult] = useState(null);
  let [likeMap, setLikeMap] = useState({});
  let [saveMap, setSaveMap] = useState({});
  let [likeCounts, setLikeCounts] = useState({});
  const [openMenuId, setOpenMenuId] = useState(null);

  useEffect(() => {
    async function getUserProfile() {
      let res = await api.get("/userprofile/user");
      const data = res.data;

      setResult(data);

      const counts = {};
      const likeStatus = {};
      const saveStatus = {};

      await Promise.all(
        data.createdPosts.map(async (p) => {
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
  }, []);

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

  async function deletePost(postId) {
    try {
      await api.delete(`/post/delete/${postId}`);

      setResult((prev) => ({
        ...prev,
        createdPosts: prev.createdPosts.filter((p) => p._id !== postId),
        createdPostsCount: prev.createdPostsCount - 1,
      }));

      setOpenMenuId(null);

      alert("Post deleted");
    } catch (err) {
      console.log(err.message);
    }
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
          <button
            onClick={() => {
              navigate("/userprofile/update");
            }}
          >
            Edit Profile
          </button>
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

                    <div className="post-menu-wrapper ">
                      <EllipsisVertical
                        className="post-menu-icon"
                        onClick={() =>
                          setOpenMenuId(
                            openMenuId === post._id ? null : post._id,
                          )
                        }
                      />

                      {openMenuId === post._id && (
                        <div className="post-dropdown">
                          <button onClick={() => deletePost(post._id)}>
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
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
