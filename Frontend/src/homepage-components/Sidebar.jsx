import { useState } from "react";
import { House, Play, Search, Plus, CircleUserRound, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AppRoutes from "../app-routes/AppRoutes.jsx";

export default function Sidebar() {
  const navigate = useNavigate();

  return (
    <>
      <button
        onClick={() => {
          navigate("/home");
        }}
      >
        <House />
      </button>
      <Play />
      <Search />
      <Plus />
      <CircleUserRound />
      <Menu />
      <AppRoutes />
    </>
  );
}
