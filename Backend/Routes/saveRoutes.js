import express from "express";
import { authenticateUser } from "../Controllers/userAuth.js";
import {
  savePost,
  unsavePost,
  isSaved,
} from "../Controllers/saveController.js";

const router = express.Router();

router.post("/save", authenticateUser, savePost);
router.put("/unsave", authenticateUser, unsavePost);
router.get("/issaved", authenticateUser, isSaved);

export default router;
