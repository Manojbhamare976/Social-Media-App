import { useState } from "react";
import api from "../api/axiosUserClient";
import "./EditProfile.css";

export default function EditProfile() {
  const [profilePic, setProfilePic] = useState("");
  const [bio, setBio] = useState("");
  const [selectedFileName, setSelectedFileName] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // 5 MB limit for profile pic
    if (file.size > 5 * 1024 * 1024) {
      alert("Image is too large. Please select a smaller image.");
      e.target.value = "";
      return;
    }

    setSelectedFileName(file.name);

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setProfilePic(reader.result);
    };
  };

  async function updateProfile(e) {
    e.preventDefault();

    try {
      const response = await api.patch("/userprofile/update/profile", {
        profilePic,
        bio,
      });

      alert(response.data.msg);

      setProfilePic("");
      setBio("");
    } catch (err) {
      if (err.response?.status === 413) {
        alert("Image size is too large. Please select a smaller image.");
      } else {
        alert(err.response?.data?.msg || "Profile update failed");
      }
    }
  }

  async function removeProfilePic() {
    try {
      const res = await api.patch("/userprofile/remove/profilepic");

      alert(res.data.msg);
    } catch (err) {
      alert(err.response?.data?.msg || err.message);
    }
  }

  return (
    <div className="edit-profile-page">
      <form className="edit-profile-card" onSubmit={updateProfile}>
        <h2>Edit Profile</h2>

        <label className="custom-file-btn">
          {selectedFileName || "Choose profile picture"}
          <input
            type="file"
            accept="image/*"
            className="edit-profile-file"
            onChange={handleFileChange}
          />
        </label>

        <input
          className="bio-input"
          type="text"
          placeholder="Update bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
        />

        <button className="update-btn" type="submit">
          Update profile
        </button>
      </form>

      <button className="remove-btn" onClick={removeProfilePic}>
        Remove current profile picture
      </button>
    </div>
  );
}
