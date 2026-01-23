import express from "express";
import cors from "cors";
import postRoutes from "./Routes/postRoutes.js";
import userAuthRoutes from "./Routes/userAuthRoutes.js";
import dotenv from "dotenv";
import connectDB from "./db.js";
import cookieParser from "cookie-parser";

dotenv.config();
//DB connection
connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//post routes
app.use("/post", postRoutes);

//user auth routes
app.use("/user", userAuthRoutes);

app.listen(3000, () => console.log("Server running on port 3000"));
