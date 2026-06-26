import dotenv from "dotenv";
dotenv.config({ path: "../../.env" });

import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { env } from "../config/env";
import User from "../models/User";
import Scholarship from "../models/Scholarship";
import GovernmentScheme from "../models/GovernmentScheme";

const seedUsers = async () => {
  const existingDemo = await User.findOne({ email: "demo@shikshasetu.local" });
  if (existingDemo) {
    console.log("Demo user already exists, skipping...");
    return;
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash("password123", salt);

  await User.create({
    name: "Demo User",
    email: "demo@shikshasetu.local",
    password: hashedPassword,
  });

  console.log("Demo user created (demo@shikshasetu.local / password123)");
};

const seedScholarships = async () => {
  const scholarships = [
    {
      title: "Reliance Foundation Undergraduate Scholarship",
      provider: "Reliance Foundation",
      description: "Need-cum-merit support for first-year undergraduate students across India.",
      amount: "Up to INR 2,00,000 over the degree programme",
      deadline: new Date("2026-10-15T23:59:59.000Z"),
      eligibility: "First-year undergraduate students enrolled in a full-time degree programme in India.",
      category: "Merit-cum-Means",
      state: "All India",
      degree: "Undergraduate",
      stream: "Any",
      applyUrl: "https://www.scholarships.reliancefoundation.org/",
      detailsUrl: "https://www.scholarships.reliancefoundation.org/",
      logo: "",
      source: "Reliance Foundation Scholarships",
      isActive: true,
      lastUpdated: new Date(),
    },
    {
      title: "National Means-cum-Merit Scholarship Scheme",
      provider: "Ministry of Education",
      description: "Central sector scholarship for meritorious students from economically weaker sections.",
      amount: "INR 12,000 per year",
      deadline: new Date("2026-11-30T23:59:59.000Z"),
      eligibility: "Class 9 students selected through the state or UT NMMS examination.",
      category: "Government",
      state: "All India",
      degree: "School",
      stream: "Any",
      applyUrl: "https://scholarships.gov.in/",
      detailsUrl: "https://scholarships.gov.in/public/schemeGuidelines/NMMSS_Guidelines.pdf",
      logo: "",
      source: "National Scholarship Portal",
      isActive: true,
      lastUpdated: new Date(),
    },
    {
      title: "AICTE Pragati Scholarship Scheme for Girl Students",
      provider: "All India Council for Technical Education",
      description: "Scholarship support for girl students admitted to AICTE-approved technical institutions.",
      amount: "INR 50,000 per year",
      deadline: new Date("2026-12-31T23:59:59.000Z"),
      eligibility: "Girl students admitted to first or second year of a technical diploma or degree course.",
      category: "Government",
      state: "All India",
      degree: "Undergraduate",
      stream: "Engineering",
      applyUrl: "https://scholarships.gov.in/",
      detailsUrl: "https://www.aicte-india.org/schemes/students-development-schemes",
      logo: "",
      source: "AICTE",
      isActive: true,
      lastUpdated: new Date(),
    },
    {
      title: "AICTE Saksham Scholarship Scheme",
      provider: "All India Council for Technical Education",
      description: "Scholarship support for specially-abled students pursuing technical education.",
      amount: "INR 50,000 per year",
      deadline: new Date("2026-12-31T23:59:59.000Z"),
      eligibility: "Specially-abled students admitted to first or second year of an AICTE-approved course.",
      category: "Government",
      state: "All India",
      degree: "Undergraduate",
      stream: "Engineering",
      applyUrl: "https://scholarships.gov.in/",
      detailsUrl: "https://www.aicte-india.org/schemes/students-development-schemes",
      logo: "",
      source: "AICTE",
      isActive: true,
      lastUpdated: new Date(),
    },
    {
      title: "Ishan Uday Special Scholarship Scheme for North Eastern Region",
      provider: "University Grants Commission",
      description: "UGC scholarship for students from the North Eastern Region pursuing general, professional, or technical degrees.",
      amount: "Up to INR 7,800 per month",
      deadline: new Date("2026-12-31T23:59:59.000Z"),
      eligibility: "Domicile students of North Eastern states admitted to the first year of a recognized degree course.",
      category: "Government",
      state: "North East",
      degree: "Undergraduate",
      stream: "Any",
      applyUrl: "https://scholarships.gov.in/",
      detailsUrl: "https://www.ugc.gov.in/Scholarships",
      logo: "",
      source: "University Grants Commission",
      isActive: true,
      lastUpdated: new Date(),
    },
    {
      title: "Sitaram Jindal Foundation Scholarship",
      provider: "Sitaram Jindal Foundation",
      description: "Scholarship for school, undergraduate, postgraduate, diploma, and professional course students.",
      amount: "Varies by course and category",
      deadline: new Date("2027-03-31T23:59:59.000Z"),
      eligibility: "Students meeting course-specific academic and family-income criteria.",
      category: "Private",
      state: "All India",
      degree: "Undergraduate",
      stream: "Any",
      applyUrl: "https://www.sitaramjindalfoundation.org/scholarships-for-students-in-bangalore.php",
      detailsUrl: "https://www.sitaramjindalfoundation.org/scholarships-for-students-in-bangalore.php",
      logo: "",
      source: "Sitaram Jindal Foundation",
      isActive: true,
      lastUpdated: new Date(),
    },
    {
      title: "Tata Trusts Education Grant",
      provider: "Tata Trusts",
      description: "Individual education grants supporting students pursuing higher education in India.",
      amount: "Need-based assistance",
      deadline: new Date("2027-01-31T23:59:59.000Z"),
      eligibility: "Students pursuing eligible higher-education courses who satisfy Tata Trusts grant criteria.",
      category: "Private",
      state: "All India",
      degree: "Undergraduate",
      stream: "Any",
      applyUrl: "https://www.tatatrusts.org/our-work/education/individual-grants-programme",
      detailsUrl: "https://www.tatatrusts.org/our-work/education/individual-grants-programme",
      logo: "",
      source: "Tata Trusts",
      isActive: true,
      lastUpdated: new Date(),
    },
    {
      title: "K. C. Mahindra Scholarship for Post-Graduate Studies Abroad",
      provider: "K. C. Mahindra Education Trust",
      description: "Interest-free loan scholarship for Indian students admitted to postgraduate studies abroad.",
      amount: "Interest-free loan scholarship up to INR 10,00,000",
      deadline: new Date("2027-03-31T23:59:59.000Z"),
      eligibility: "Indian graduates with admission to a recognized postgraduate course abroad.",
      category: "Private",
      state: "All India",
      degree: "Postgraduate",
      stream: "Any",
      applyUrl: "https://www.kcmet.org/what-we-do-Scholarship-Grants.aspx",
      detailsUrl: "https://www.kcmet.org/what-we-do-Scholarship-Grants.aspx",
      logo: "",
      source: "K. C. Mahindra Education Trust",
      isActive: true,
      lastUpdated: new Date(),
    },
  ];

  await Scholarship.bulkWrite(
    scholarships.map((scholarship) => ({
      updateOne: {
        filter: { title: scholarship.title, source: scholarship.source },
        update: { $set: scholarship },
        upsert: true,
      },
    }))
  );

  console.log(`Scholarships seeded (${scholarships.length} upserted)`);
};

const seedGovernmentSchemes = async () => {
  const count = await GovernmentScheme.countDocuments();
  if (count > 0) {
    console.log("Government schemes already seeded, skipping...");
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

  console.log("Government schemes seeded");
};

const runSeed = async () => {
  try {
    console.log("\nStarting database seed...\n");
    await mongoose.connect(env.MONGO_URI);
    console.log("Connected to MongoDB\n");

    await seedUsers();
    await seedScholarships();
    await seedGovernmentSchemes();

    console.log("\nDatabase seeding completed!\n");
    process.exit(0);
  } catch (error) {
    console.error("Seed error:", error);
    process.exit(1);
  }
};

runSeed();
