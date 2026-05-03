import express from "express";
import {
  signup,
  login,
  logout,
  loginLimiter,
  refresh,
  checkAuth,
  authenticateUser,
} from "../Controllers/userAuth.js";
const router = express.Router();

router.post("/signup", signup);
router.post("/login", loginLimiter, login);
router.get("/refresh", refresh);
router.put("/logout", logout);
router.get("/check-auth", authenticateUser, checkAuth);
export default router;
