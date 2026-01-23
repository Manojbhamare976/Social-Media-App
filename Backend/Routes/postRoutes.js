import express from "express";
import { createPost, deletePost } from "../Controllers/postController.js";
const router = express.Router();

router.post("/create", createPost);
router.delete("/delete", deletePost);
export default router;
