import express from "express";

import {
  createComment,
  deleteComment,
  showComments,
} from "../Controllers/commentController.js";
import { authenticateUser } from "../Controllers/userAuth.js";

const router = express.Router();

router.post("/create", authenticateUser, createComment);
router.delete("/delete", authenticateUser, deleteComment);
router.get("/comments", authenticateUser, showComments);

export default router;
