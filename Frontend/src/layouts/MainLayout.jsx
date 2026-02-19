import { Outlet } from "react-router-dom";
import Sidebar from "../homepage-components/Sidebar.jsx";

export default function MainLayout() {
  return (
    <div className="homepage-layout">
      <Sidebar />
      <Outlet />
    </div>
  );
}
