import express from "express";
import { signup, login, logout } from "../Controllers/userAuth.js";
const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.put("/logout", logout);
export default router;
