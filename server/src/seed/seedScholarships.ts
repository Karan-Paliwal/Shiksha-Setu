import dotenv from "dotenv";
dotenv.config({ path: "../.env" });

import mongoose from "mongoose";
import { env } from "../config/env";
import { connectDB } from "../config/db";
import { seedScholarshipsIfEmpty } from "./scholarshipSeeder";

const run = async () => {
  try {
    await connectDB();
    const insertedCount = await seedScholarshipsIfEmpty();
    console.log(`Scholarship seed complete. Inserted: ${insertedCount}`);
  } catch (error) {
    console.error("Scholarship seed failed:", error);
    process.exitCode = 1;
  } finally {
    if (env.MONGO_URI) {
      await mongoose.disconnect();
    }
  }
};

run();
