import express from "express";
import { createPost } from "../Controllers/postController.js";
const router = express.Router();

router.post("/create", createPost);

export default router;
