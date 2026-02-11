import { useState, useEffect } from "react";
import api from "../api/axiosUserClient";
import { Heart, MessageCircle, Bookmark } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Userprofile() {
  const navigate = useNavigate();
  let [result, setResult] = useState(null);

  useEffect(() => {
    async function getUserProfile() {
      let res = await api.get("/userprofile/user");
      console.log(res.data);
      setResult(res.data);
      console.log(result);
    }
    getUserProfile();
  }, []);

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
      {result && (
        <div>
          <img src={result.profilePic} alt="no profile image" />
          <p>{result.username}</p>
          <p>{result.bio}</p>
          <p>{result.createdPostsCount}</p>
          <p>posts</p>
          <p>{result.followersCount}</p>
          <p>followers</p>
          <p>{result.followingCount}</p>
          <p>following</p>
          {result.createdPostsCount > 0 ? (
            <div>
              {result.createdPosts.map((post, i) => (
                <div key={i}>
                  {post.content.includes("video") ? (
                    <video key={i} src={post.content} controls width="300" />
                  ) : (
                    <img key={i} src={post.content} width={"300"} />
                  )}
                  <button
                    onClick={async () => {
                      let result = await isliked(post._id);
                      if (result) {
                        dislikePost(post._id);
                      } else {
                        likePost(post._id);
                      }
                    }}
                  >
                    <Heart />
                  </button>
                  <button
                    onClick={() => {
                      navigate({
                        pathname: "/comment",
                        search: `?postId=${post._id}`,
                        replace: true,
                      });
                    }}
                  >
                    <MessageCircle />
                  </button>
                  <button
                    onClick={async () => {
                      let result = await isSaved(post._id);
                      if (result) {
                        unsavePost(post._id);
                      } else {
                        savePost(post._id);
                      }
                    }}
                  >
                    <Bookmark />
                  </button>
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
