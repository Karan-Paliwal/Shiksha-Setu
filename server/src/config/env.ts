// ─── Environment Configuration ───────────────────────────
// Centralizes all env vars with defaults for development

export const env = {
  PORT: parseInt(process.env.PORT || "5000", 10),
  NODE_ENV: process.env.NODE_ENV || "development",
  MONGO_URI: process.env.MONGO_URI || "mongodb://localhost:27017/shikshasetu",
  JWT_SECRET: process.env.JWT_SECRET || "dev_secret_change_in_production",
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",
  CLIENT_URL: process.env.CLIENT_URL || "http://localhost:5173",
};
