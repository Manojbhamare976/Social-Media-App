import express from "express";
import { increaseFollowers } from "../Controllers/userController.js";
import { authenticateUser } from "../Controllers/userAuth.js";
const router = express.Router();

router.post("/increase/followers", authenticateUser, increaseFollowers);

export default router;
