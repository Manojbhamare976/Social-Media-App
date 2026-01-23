import express from "express";
import { signup, login } from "../Controllers/userAuth.js";
const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
export default router;
