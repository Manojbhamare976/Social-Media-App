import express from "express";
import {
  increaseFollowers,
  isFollowing,
  decreaseFollowers,
  findUser,
  findUserById,
  updateProfile,
  removeProfilePic,
  findUserProfile,
} from "../Controllers/userController.js";
import { authenticateUser } from "../Controllers/userAuth.js";
const router = express.Router();

router.post("/increase/followers", authenticateUser, increaseFollowers);
router.get("/isfollowing", authenticateUser, isFollowing);
router.put("/decrease/followers", authenticateUser, decreaseFollowers);
router.get("/find/user", authenticateUser, findUser);
router.get("/user", authenticateUser, findUserById);
router.get("/userprofile/:userId", authenticateUser, findUserProfile);
router.patch("/update/profile", authenticateUser, updateProfile);
router.patch("/remove/profilepic", authenticateUser, removeProfilePic);
export default router;
