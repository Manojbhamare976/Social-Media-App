import { useState } from "react";
import api from "../api/axiosUserClient.js";
import { Link } from "react-router-dom";

export default function Signup() {
  let [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  let [signedUp, setSignedUp] = useState(false);
  let [error, setError] = useState({ text: "" });
  let [usernameError, setUsernameError] = useState({ text: "" });
  let [passwordError, setPasswordError] = useState({ text: "" });
  let [emailError, setEmailError] = useState({ text: "" });

  async function submitForm(e) {
    e.preventDefault();

    setError({ text: "" });
    setUsernameError({ text: "" });
    setPasswordError({ text: "" });
    setEmailError({ text: "" });

    let username = formData.username.trim();
    let email = formData.email.trim();
    let password = formData.password;

    if (username.length <= 0) {
      return setUsernameError({ text: "Please enter username" });
    } else if (email.length <= 0) {
      return setEmailError({ text: "Please enter email" });
    } else if (password.length <= 0) {
      return setPasswordError({ text: "Please enter password" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return setEmailError({
        text: "Please enter a valid email address",
      });
    }

    if (password.length < 6) {
      return setPasswordError({
        text: "password must contain atleast 6 characters",
      });
    }

    try {
      await api.post("http://localhost:3000/user/signup", {
        username: username,
        email: email,
        password: password,
      });
      setSignedUp(true);
      return console.log("user signed up successfully");
    } catch (err) {
      setError({ text: err.response?.data?.msg || "Something went wrong" });
    }
  }

  return (
    <>
      <div>
        <form onSubmit={submitForm}>
          <input
            value={formData.username}
            name="username"
            type="text"
            placeholder="Enter username"
            onChange={(e) => {
              setFormData({ ...formData, [e.target.name]: e.target.value });
            }}
          />
          {usernameError.text.length > 0 ? <p>{usernameError.text}</p> : null}
          <input
            value={formData.email}
            name="email"
            type="email"
            placeholder="Enter email"
            onChange={(e) => {
              setFormData({ ...formData, [e.target.name]: e.target.value });
            }}
          />
          {emailError.text.length > 0 ? <p>{emailError.text}</p> : null}
          <input
            value={formData.password}
            name="password"
            type="password"
            placeholder="Enter password"
            onChange={(e) => {
              setFormData({ ...formData, [e.target.name]: e.target.value });
            }}
          />
          {passwordError.text.length > 0 ? <p>{passwordError.text}</p> : null}
          {signedUp === true ? (
            <button type="submit" disabled>
              Sign Up
            </button>
          ) : (
            <button type="submit">Sign Up</button>
          )}

          {signedUp ? (
            <p>
              signup successfull click here to{" "}
              <Link to="/login" replace>
                login
              </Link>
            </p>
          ) : null}

          {error.text.length > 0 ? <p>{error.text}</p> : null}
        </form>
      </div>
    </>
  );
}
