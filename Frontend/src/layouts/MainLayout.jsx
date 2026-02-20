import { Outlet } from "react-router-dom";
import Sidebar from "../homepage-components/Sidebar.jsx";
import "./MainLayout.css";
export default function MainLayout() {
  return (
    <div className="homepage-layout">
      <Sidebar />
      <Outlet />
    </div>
  );
}
