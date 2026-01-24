import express from "express";
import {
  signup,
  login,
  logout,
  loginLimiter,
} from "../Controllers/userAuth.js";
const router = express.Router();

router.post("/signup", signup);
router.post("/login", loginLimiter, login);
router.put("/logout", logout);
export default router;
