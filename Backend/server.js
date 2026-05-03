import "dotenv/config";

import express from "express";
import cors from "cors";
import postRoutes from "./Routes/postRoutes.js";
import userAuthRoutes from "./Routes/userAuthRoutes.js";
import commentRoutes from "./Routes/commentRoutes.js";
import userprofileRoutes from "./Routes/userRoutes.js";
import likeRoutes from "./Routes/likeRoutes.js";
import saveRoutes from "./Routes/saveRoutes.js";
import connectDB from "./db.js";
import cookieParser from "cookie-parser";

//DB connection
const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
};

startServer();

const app = express();

const allowedOrigins = [
  "https://social-media-app-zeta-tan.vercel.app/",
  "http://localhost:5173",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
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

app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
