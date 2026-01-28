import express from "express";
import {
  increaseFollowers,
  isFollowing,
} from "../Controllers/userController.js";
import { authenticateUser } from "../Controllers/userAuth.js";
const router = express.Router();

router.post("/increase/followers", authenticateUser, increaseFollowers);
router.get("/isfollowing", authenticateUser, isFollowing);

export default router;
