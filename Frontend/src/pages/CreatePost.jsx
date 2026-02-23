import { useState } from "react";
import api from "../api/axiosUserClient";
import "./CreatePost.css";
export default function CreatePost() {
  const [files, setFiles] = useState([]);
  const [caption, setCaption] = useState("");

  async function handleCreatePost() {
    if (!files.length) {
      alert("Please select image or video");
      return;
    }

    const formData = new FormData();

    formData.append("caption", caption);

    files.forEach((file) => {
      formData.append("content", file);
    });

    try {
      await api.post("/post/create", formData, {
        withCredentials: true,
      });

      alert("Post created");
      setFiles([]);
      setCaption("");
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className="create-post-container poppins-medium">
      <h2 className="create-post-title">Create Post</h2>

      <label className="file-upload-label">
        <input
          type="file"
          accept="image/*,video/*"
          onChange={(e) => setFiles([e.target.files[0]])}
          className="file-input"
        />
        {files.length > 0 ? `${files[0].name}` : "Choose photo or video"}
      </label>
      <input
        type="text"
        placeholder="Write a Caption..."
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        className="caption-input poppins-medium"
      />

      <button className="upload-btn poppins-medium" onClick={handleCreatePost}>
        Upload
      </button>
    </div>
  );
}
