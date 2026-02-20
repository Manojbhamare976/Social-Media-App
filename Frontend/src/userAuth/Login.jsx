import { useState, useEffect } from "react";
import api from "../api/axiosUserClient.js";
import { useNavigate } from "react-router-dom";
import "./Login.css";

export default function Login() {
  const navigate = useNavigate();

  let [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  let [loggedIn, setLoggedIn] = useState(false);
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
      await api.post("http://localhost:3000/user/login", {
        username: username,
        email: email,
        password: password,
      });
      setLoggedIn(true);
      return console.log("User logged in successfully");
    } catch (err) {
      setError({ text: err.response?.data?.msg || "Something went wrong" });
    }
  }

  useEffect(() => {
    if (loggedIn) {
      navigate("/", { replace: true });
    }
  }, [loggedIn, navigate]);

  return (
    <div className="login-page">
      <div className="form-container">
        <h1 className="montserrat-login-text">Login</h1>
        <form className="login-form" onSubmit={submitForm}>
          <input
            className="login-form-input poppins-medium"
            name="username"
            type="text"
            placeholder="Enter Username"
            value={formData.username}
            onChange={(e) => {
              setFormData({ ...formData, [e.target.name]: e.target.value });
            }}
          />
          {usernameError.text.length > 0 ? (
            <p className="err-msg poppins-medium">{usernameError.text}</p>
          ) : null}
          <input
            className="login-form-input poppins-medium"
            name="email"
            type="email"
            placeholder="Enter email"
            value={formData.email}
            onChange={(e) => {
              setFormData({ ...formData, [e.target.name]: e.target.value });
            }}
          />
          {emailError.text.length > 0 ? (
            <p className="err-msg poppins-medium">{emailError.text}</p>
          ) : null}
          <input
            className="login-form-input poppins-medium"
            name="password"
            type="password"
            placeholder="Enter password"
            value={formData.password}
            onChange={(e) => {
              setFormData({ ...formData, [e.target.name]: e.target.value });
            }}
          />
          {passwordError.text.length > 0 ? (
            <p className="err-msg poppins-medium">{passwordError.text}</p>
          ) : null}
          {loggedIn ? (
            <button
              type="submit"
              disabled
              className="poppins-medium login-button"
            >
              Login
            </button>
          ) : (
            <button type="submit" className="poppins-medium login-button">
              Login
            </button>
          )}

          {error.text.length > 0 ? (
            <p className="err-msg poppins-medium">{error.text}</p>
          ) : null}
        </form>
      </div>
    </div>
  );
}
