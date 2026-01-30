import express from "express";
import { authenticateUser } from "../Controllers/userAuth.js";
import { savePost } from "../Controllers/saveController.js";

const router = express.Router();

router.post("/save", authenticateUser, savePost);

export default router;
