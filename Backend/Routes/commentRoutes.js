import express from "express";

import {
  createComment,
  deleteComment,
  showComments,
  reply,
  showReply,
  likeComment,
} from "../Controllers/commentController.js";
import { authenticateUser } from "../Controllers/userAuth.js";

const router = express.Router();

router.post("/create", authenticateUser, createComment);
router.delete("/delete/:commentId", authenticateUser, deleteComment);
router.get("/comments", authenticateUser, showComments);
router.post("/reply", authenticateUser, reply);
router.get("/showreply", authenticateUser, showReply);
router.post("/likecomment", authenticateUser, likeComment);
export default router;
