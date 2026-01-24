import express from "express";

import {
  createComment,
  deleteComment,
} from "../Controllers/commentController.js";
import { authenticateUser } from "../Controllers/userAuth.js";

const router = express.Router();

router.post("/create", authenticateUser, createComment);
router.delete("/delete", authenticateUser, createComment);

export default router;
