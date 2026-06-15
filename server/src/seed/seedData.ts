import dotenv from "dotenv";
dotenv.config({ path: "../../.env" });

import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { env } from "../config/env";
import User from "../models/User";
import Scholarship from "../models/Scholarship";
import GovernmentScheme from "../models/GovernmentScheme";

// ─── Seed Data ───────────────────────────────────────────

const seedUsers = async () => {
  const existingDemo = await User.findOne({ email: "demo@shikshasetu.local" });
  if (existingDemo) {
    console.log("⏭️  Demo user already exists, skipping...");
    return;
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash("password123", salt);

  await User.create({
    name: "Demo User",
    email: "demo@shikshasetu.local",
    password: hashedPassword,
  });

  console.log("✅ Demo user created (demo@shikshasetu.local / password123)");
};

const seedScholarships = async () => {
  const count = await Scholarship.countDocuments();
  if (count > 0) {
    console.log("⏭️  Scholarships already seeded, skipping...");
    return;
  }

  await Scholarship.insertMany([
    {
      title: "National Merit Scholarship",
      amount: "₹50,000/year",
      eligibility: "Students with 90%+ in Class 12",
    },
    {
      title: "Post-Matric Scholarship for SC/ST Students",
      amount: "Full tuition + ₹10,000/month",
      eligibility: "SC/ST students with family income below ₹2.5 LPA",
    },
    {
      title: "INSPIRE Scholarship",
      amount: "₹80,000/year",
      eligibility: "Top 1% in Class 12 Board Exams",
    },
    {
      title: "Pragati Scholarship for Girls",
      amount: "₹50,000/year",
      eligibility: "Girl students in technical education, family income < ₹8 LPA",
    },
    {
      title: "Central Sector Scheme of Scholarships",
      amount: "₹20,000/year",
      eligibility: "Top 82nd percentile in Class 12 Board Exams",
    },
  ]);

  console.log("✅ Scholarships seeded");
};

const seedGovernmentSchemes = async () => {
  const count = await GovernmentScheme.countDocuments();
  if (count > 0) {
    console.log("⏭️  Government schemes already seeded, skipping...");
    return;
  }

  await GovernmentScheme.insertMany([
    {
      title: "PM Vidyalaxmi Scheme",
      description: "Collateral-free, guarantor-free education loans for students admitted to QHEIs.",
      eligibility: "Students admitted to quality higher education institutions",
    },
    {
      title: "Skill India Digital Hub",
      description: "Free online courses and certifications to enhance employability skills.",
      eligibility: "All Indian citizens above 15 years",
    },
    {
      title: "PMKVY (Pradhan Mantri Kaushal Vikas Yojana)",
      description: "Skill development training and certification with placement assistance.",
      eligibility: "Indian nationals, class 10 pass or above",
    },
    {
      title: "Digital India Internship Scheme",
      description: "Internship opportunities in government departments working on digital initiatives.",
      eligibility: "B.Tech/MCA/M.Tech students in CS/IT/Electronics",
    },
  ]);

  console.log("✅ Government schemes seeded");
};

// ─── Run Seed ────────────────────────────────────────────
const runSeed = async () => {
  try {
    console.log("\n🌱 Starting database seed...\n");
    await mongoose.connect(env.MONGO_URI);
    console.log("✅ Connected to MongoDB\n");

    await seedUsers();
    await seedScholarships();
    await seedGovernmentSchemes();

    console.log("\n🎉 Database seeding completed!\n");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seed error:", error);
    process.exit(1);
  }
};

runSeed();
