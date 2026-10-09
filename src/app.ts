import express from "express";
import healthRoutes from "./routes/health.routes";
import authRoutes from "./routes/auth.routes";
import postRoutes from "./routes/post.routes";

const app = express();
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/health", healthRoutes);
app.use("/api/posts", postRoutes);

export default app;