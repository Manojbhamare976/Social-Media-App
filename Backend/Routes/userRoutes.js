import express from "express";
import {
  increaseFollowers,
  isFollowing,
  decreaseFollowers,
} from "../Controllers/userController.js";
import { authenticateUser } from "../Controllers/userAuth.js";
const router = express.Router();

router.post("/increase/followers", authenticateUser, increaseFollowers);
router.get("/isfollowing", authenticateUser, isFollowing);
router.put("/decrease/followers", authenticateUser, decreaseFollowers);

export default router;
