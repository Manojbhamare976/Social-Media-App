import express from "express";
import cors from "cors";
import postRoutes from "./Routes/postRoutes.js";
import userAuthRoutes from "./Routes/userAuthRoutes.js";
import commentRoutes from "./Routes/commentRoutes.js";
import userprofileRoutes from "./Routes/userRoutes.js";
import likeRoutes from "./Routes/likeRoutes.js";
import saveRoutes from "./Routes/saveRoutes.js";
import dotenv from "dotenv";
import connectDB from "./db.js";
import cookieParser from "cookie-parser";

dotenv.config();
//DB connection
connectDB();

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//post routes
app.use("/post", postRoutes);

//user auth routes
app.use("/user", userAuthRoutes);

//user profile routes
app.use("/userprofile", userprofileRoutes);

//like routes
app.use("/like", likeRoutes);

//comment routes
app.use("/comment", commentRoutes);

//post routes
app.use("/save", saveRoutes);

app.listen(3000, () => console.log("Server running on port 3000"));
