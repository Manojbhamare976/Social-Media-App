import { useState } from "react";
import api from "../api/axiosUserClient";

export default function EditProfile() {
  const [profilePic, setProfilePic] = useState("");
  const [bio, setBio] = useState("");

  // Function to convert file to Base64 string
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setProfilePic(reader.result); // This is the Base64 string
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
    } catch (err) {
      console.log(err.response?.data?.msg || err.message);
    }
  }

  async function removeProfilePic() {
    try {
      await api.patch("/userprofile/remove/profilepic");
    } catch (err) {
      console.log(err.message);
    }
  }

  return (
    <div>
      <form onSubmit={updateProfile}>
        <input type="file" accept="image/*" onChange={handleFileChange} />

        <input
          type="text"
          placeholder="Update bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
        />

        <button type="submit">update profile</button>
      </form>
      <button onClick={removeProfilePic}>Remove current profile pic</button>
    </div>
  );
}
