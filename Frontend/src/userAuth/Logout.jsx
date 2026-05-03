import { useState } from "react";
import api from "../api/axiosUserClient.js";

export default function Logout() {
  async function logout() {
    try {
      await api.put("/user/logout");
      window.location.href = "/signup";
    } catch (err) {
      console.log(err.message);
    }
  }

  return (
    <>
      <button onClick={logout}>Logout</button>
    </>
  );
}
