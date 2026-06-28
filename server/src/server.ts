import dotenv from "dotenv";
dotenv.config({ path: "../.env" });

import express from "express";
import cors from "cors";
import morgan from "morgan";
import { connectDB } from "./config/db";
import { env } from "./config/env";

// Route imports
import authRoutes from "./routes/auth";
import academicsRoutes from "./routes/academics";
import aiRoutes from "./routes/ai";
import opportunitiesRoutes from "./routes/opportunities";
import careerRoutes from "./routes/career";
import profileRoutes from "./routes/profile";
import scheduleRoutes from "./routes/schedule";
import courseRoutes from "./routes/courseRoutes";

const app = express();

// ─── Middleware ───────────────────────────────────────────
app.use(cors({ origin: env.CLIENT_URL, credentials: true }));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(morgan("dev"));

// ─── API Routes ──────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/academics", academicsRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/opportunities", opportunitiesRoutes);
app.use("/api/career", careerRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/schedule", scheduleRoutes);
app.use("/api/courses", courseRoutes);

// ─── Health Check ────────────────────────────────────────
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", message: "ShikshaSetu API is running 🚀" });
});

// ─── Global Error Handler ────────────────────────────────
app.use(
  (
    err: Error,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    console.error("❌ Error:", err.message);
    res.status(500).json({ error: "Internal Server Error", message: err.message });
  }
);

// ─── Start Server ────────────────────────────────────────
const PORT = env.PORT;

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`\n🚀 ShikshaSetu Server running on http://localhost:${PORT}`);
    console.log(`📡 API Base URL: http://localhost:${PORT}/api`);
    console.log(`🔑 Environment: ${env.NODE_ENV}\n`);
  });
};

startServer();

export default app;
