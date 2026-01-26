import { useState } from "react";
import api from "../api/axiosUserClient.js";

export default function Signup() {
  let [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  async function submitForm(e) {
    e.preventDefault();
    let username = formData.username;
    let email = formData.email;
    let password = formData.password;

    try {
      await api.post("http://localhost:3000/user/signup", {
        username: username,
        email: email,
        password: password,
      });
      return console.log("user signed up successfully");
    } catch (err) {
      return console.log(err.message);
    }
  }

  return (
    <>
      <div>
        <form>
          <input
            value={formData.username}
            name="username"
            type="text"
            placeholder="Enter username"
            onChange={(e) => {
              setFormData({ ...formData, [e.target.name]: e.target.value });
            }}
          />
          <input
            value={formData.email}
            name="email"
            type="email"
            placeholder="Enter email"
            onChange={(e) => {
              setFormData({ ...formData, [e.target.name]: e.target.value });
            }}
          />
          <input
            value={formData.password}
            name="password"
            type="password"
            placeholder="Enter password"
            onChange={(e) => {
              setFormData({ ...formData, [e.target.name]: e.target.value });
            }}
          />
          <button onClick={submitForm}>Sign Up</button>
        </form>
      </div>
    </>
  );
}
