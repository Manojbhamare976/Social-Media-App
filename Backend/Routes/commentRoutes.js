import express from "express";

import {
  createComment,
  deleteComment,
  showComments,
  reply,
  showReply,
} from "../Controllers/commentController.js";
import { authenticateUser } from "../Controllers/userAuth.js";

const router = express.Router();

router.post("/create", authenticateUser, createComment);
router.delete("/delete/:commentId", authenticateUser, deleteComment);
router.get("/comments", authenticateUser, showComments);
router.post("/reply", authenticateUser, reply);
router.get("/showreply", authenticateUser, showReply);

export default router;
