import express from "express";
import cors from "cors";
import postRoutes from "./Routes/postRoutes";

const app = express();

app.use(cors());
app.use(express.json());

//post routes
app.use("/post", postRoutes);

app.listen(3000, () => console.log("Server running on port 3000"));
