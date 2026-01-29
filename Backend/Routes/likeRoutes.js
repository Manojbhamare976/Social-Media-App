import express from "express";
import { like } from "../Controllers/likeController.js";
import { authenticateUser } from "../Controllers/userAuth.js";
const router = express.Router();

router.post("/like", authenticateUser, like);

export default router;
