import dotenv from "dotenv";
dotenv.config({ path: "../.env" });

import { mkdir, writeFile } from "fs/promises";
import path from "path";
import mongoose from "mongoose";
import { connectDB } from "../config/db";
import Scholarship from "../models/Scholarship";
import { ScholarshipSeed, syncScholarshipsFromJson } from "./scholarshipSeeder";

const scholarshipsJsonPath = path.resolve(__dirname, "../data/scholarships.json");

const exportScholarshipsToJson = async (): Promise<number> => {
  const scholarships = await Scholarship.find().sort({ title: 1, source: 1 }).lean();

  const normalizedScholarships: ScholarshipSeed[] = scholarships.map((scholarship) => ({
    id: scholarship._id.toString(),
    title: scholarship.title,
    provider: scholarship.provider,
    description: scholarship.description,
    amount: scholarship.amount,
    deadline: scholarship.deadline.toISOString(),
    eligibility: scholarship.eligibility,
    category: scholarship.category,
    state: scholarship.state,
    degree: scholarship.degree,
    stream: scholarship.stream,
    applyUrl: scholarship.applyUrl,
    detailsUrl: scholarship.detailsUrl,
    logo: scholarship.logo,
    source: scholarship.source,
    isActive: scholarship.isActive,
    lastUpdated: scholarship.lastUpdated.toISOString(),
  }));

  await mkdir(path.dirname(scholarshipsJsonPath), { recursive: true });
  await writeFile(
    scholarshipsJsonPath,
    `${JSON.stringify(normalizedScholarships, null, 2)}\n`,
    "utf8"
  );

  return normalizedScholarships.length;
};

const run = async () => {
  const mode = process.argv.includes("--to-json") ? "to-json" : "from-json";

  try {
    await connectDB();

    if (mode === "to-json") {
      const exportedCount = await exportScholarshipsToJson();
      console.log(`Scholarship sync complete. Exported ${exportedCount} records to scholarships.json.`);
      return;
    }

    const result = await syncScholarshipsFromJson();
    console.log(
      `Scholarship sync complete. Matched: ${result.matched}, Modified: ${result.modified}, Upserted: ${result.upserted}.`
    );
  } catch (error) {
    console.error("Scholarship sync failed:", error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

run();
