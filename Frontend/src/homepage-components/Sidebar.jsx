import "./Sidebar.css";
import {
  House,
  Search,
  Plus,
  CircleUserRound,
  EllipsisVertical,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../api/axiosUserClient";

export default function Sidebar() {
  const navigate = useNavigate();
  const [openMenu, setOpenMenu] = useState(false);

  async function handleLogout() {
    try {
      await api.put("/user/logout");

      alert("Logout successfull");
      navigate("/signup");
    } catch (err) {
      console.log(err.message);
    } finally {
      setOpenMenu(false);
    }
  }

  return (
    <div className="sidebar">
      <button onClick={() => navigate("/")}>
        <House />
      </button>

      <button onClick={() => navigate("/find/user")}>
        <Search />
      </button>

      <button onClick={() => navigate("/post/create")}>
        <Plus />
      </button>

      <button onClick={() => navigate("/userprofile/user")}>
        <CircleUserRound />
      </button>

      <div className="sidebar-menu-wrapper">
        <EllipsisVertical
          className="sidebar-menu-icon"
          onClick={() => setOpenMenu((p) => !p)}
        />

        {openMenu && (
          <div className="sidebar-dropdown">
            <button onClick={handleLogout}>Logout</button>
          </div>
        )}
      </div>
    </div>
  );
}
