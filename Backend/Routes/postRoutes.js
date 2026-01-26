import express from "express";
import {
  createPost,
  deletePost,
  getPost,
} from "../Controllers/postController.js";
const router = express.Router();

router.post("/create", createPost);
router.delete("/delete", deletePost);
router.get("/find", getPost);

export default router;
