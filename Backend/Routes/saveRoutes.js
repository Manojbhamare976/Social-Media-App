import express from "express";
import { authenticateUser } from "../Controllers/userAuth.js";
import { savePost, unsavePost } from "../Controllers/saveController.js";

const router = express.Router();

router.post("/save", authenticateUser, savePost);
router.put("/unsave", authenticateUser, unsavePost);

export default router;
