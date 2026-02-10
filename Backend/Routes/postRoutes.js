import express from "express";
import {
  createPost,
  deletePost,
  getPost,
} from "../Controllers/postController.js";
import { authenticateUser } from "../Controllers/userAuth.js";
import upload from "../Middlewares/upload.js";
const router = express.Router();

router.post("/create", authenticateUser, upload.array("content"), createPost);
router.delete("/delete/:postId", authenticateUser, deletePost);
router.get("/find", getPost);

export default router;
