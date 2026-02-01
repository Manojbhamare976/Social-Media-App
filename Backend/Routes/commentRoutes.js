import express from "express";

import {
  createComment,
  deleteComment,
  showComments,
  reply,
} from "../Controllers/commentController.js";
import { authenticateUser } from "../Controllers/userAuth.js";

const router = express.Router();

router.post("/create", authenticateUser, createComment);
router.delete("/delete", authenticateUser, deleteComment);
router.get("/comments", authenticateUser, showComments);
router.post("/reply", authenticateUser, reply);

export default router;
