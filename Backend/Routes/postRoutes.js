import express from "express";
import { createPost } from "../Controllers/postController";
const router = express.Router();

router.post("/post/create", createPost);
