import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import api from "./api/axiosUserClient.js";

export default function ProtectedRoute() {
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      try {
        await api.get("/user/check-auth");
        setIsLoggedIn(true);
      } catch {
        setIsLoggedIn(false);
      } finally {
        setLoading(false);
      }
    }
    checkAuth();
  }, []);

  if (loading) return <div>Loading...</div>;

  return isLoggedIn ? <Outlet /> : <Navigate to="/signup" />;
}
