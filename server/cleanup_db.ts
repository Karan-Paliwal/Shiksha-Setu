import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  documents: mongoose.Schema.Types.Mixed,
  academicProfile: mongoose.Schema.Types.Mixed,
});
const User = mongoose.model("User", userSchema);

async function run() {
  await mongoose.connect(process.env.MONGO_URI as string);
  console.log("Connected to MongoDB.");

  const users = await User.find({});
  for (const user of users) {
    let modified = false;
    const currentSemester = user.academicProfile?.currentSemester || 1;

    // 1. Clean up semesterGpas
    if (user.academicProfile && Array.isArray(user.academicProfile.semesterGpas)) {
      if (user.academicProfile.semesterGpas.length >= currentSemester) {
        console.log(`Clearing ${user.email} current/higher semester GPAs. Old GPAs:`, user.academicProfile.semesterGpas);
        user.academicProfile.semesterGpas = user.academicProfile.semesterGpas.slice(0, currentSemester - 1);
        modified = true;
      }
    }

    // 2. Clean up documents.marksheets
    if (user.documents && user.documents.marksheets) {
      const marksheets = user.documents.marksheets;
      const keys = Object.keys(marksheets);
      for (const key of keys) {
        if (Number(key) >= currentSemester) {
          console.log(`Deleting ${user.email} marksheet for semester ${key}`);
          delete marksheets[key];
          modified = true;
        }
      }
    }

    if (modified) {
      user.markModified("academicProfile");
      user.markModified("documents");
      await user.save();
      console.log(`Saved clean profile for ${user.email}`);
    }
  }

  console.log("Database cleanup complete.");
  process.exit(0);
}

run().catch(console.error);
