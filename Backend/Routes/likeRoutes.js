import express from "express";
import { like, dislike } from "../Controllers/likeController.js";
import { authenticateUser } from "../Controllers/userAuth.js";
const router = express.Router();

router.post("/like", authenticateUser, like);
router.put("/dislike", authenticateUser, dislike);

export default router;
