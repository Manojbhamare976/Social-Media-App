import express from "express";
import {
  signup,
  login,
  logout,
  loginLimiter,
  refresh,
} from "../Controllers/userAuth.js";
const router = express.Router();

router.post("/signup", signup);
router.post("/login", loginLimiter, login);
router.get("/refresh", refresh);
router.put("/logout", logout);
export default router;
