import { useState } from "react";
import api from "../api/axiosUserClient";

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
    <div>
      <h2>Create Post</h2>

      <input
        type="file"
        multiple
        accept="image/*,video/*"
        onChange={(e) => setFiles([...e.target.files])}
      />

      <input
        type="text"
        placeholder="Caption"
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
      />

      <button onClick={handleCreatePost}>Upload</button>
    </div>
  );
}
