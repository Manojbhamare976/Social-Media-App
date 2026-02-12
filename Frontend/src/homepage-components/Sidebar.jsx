import { useState } from "react";
import { House, Search, Plus, CircleUserRound } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AppRoutes from "../app-routes/AppRoutes.jsx";

export default function Sidebar() {
  const navigate = useNavigate();

  return (
    <>
      <button
        onClick={() => {
          navigate("/");
        }}
      >
        <House />
      </button>
      <button
        onClick={() => {
          navigate("/find/user");
        }}
      >
        <Search />
      </button>
      <button
        onClick={() => {
          navigate("/post/create");
        }}
      >
        <Plus />
      </button>
      <button
        onClick={() => {
          navigate("/userprofile/user");
        }}
      >
        <CircleUserRound />
      </button>
      <AppRoutes />
    </>
  );
}
