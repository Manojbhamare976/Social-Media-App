import { useState } from "react";
import api from "../api/axiosUserClient.js";

export default function Login() {
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
      api.post("http://localhost:3000/user/login", {
        username: username,
        email: email,
        password: password,
      });
      console.log("User logged in successfully");
    } catch (err) {
      return err.message;
    }
  }

  return (
    <>
      <div>
        <form>
          <input
            name="username"
            type="text"
            placeholder="Enter Username"
            value={formData.username}
            onChange={(e) => {
              setFormData({ ...formData, [e.target.name]: e.target.value });
            }}
          />
          <input
            name="email"
            type="email"
            placeholder="Enter email"
            value={formData.email}
            onChange={(e) => {
              setFormData({ ...formData, [e.target.name]: e.target.value });
            }}
          />
          <input
            name="password"
            type="password"
            placeholder="Enter password"
            value={formData.password}
            onChange={(e) => {
              setFormData({ ...formData, [e.target.name]: e.target.value });
            }}
          />
          <button onClick={submitForm}>Login</button>
        </form>
      </div>
    </>
  );
}
