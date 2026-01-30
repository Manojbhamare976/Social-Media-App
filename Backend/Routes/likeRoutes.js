import express from "express";
import { like, dislike, isLiked } from "../Controllers/likeController.js";
import { authenticateUser } from "../Controllers/userAuth.js";
const router = express.Router();

router.post("/like", authenticateUser, like);
router.put("/dislike", authenticateUser, dislike);
router.get("/isliked", authenticateUser, isLiked);

export default router;
