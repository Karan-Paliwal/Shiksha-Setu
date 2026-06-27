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
  // Find ALL users and show their academic data
  const users = await User.find({}).lean();
  for (const u of users) {
    console.log(`\n=== User: ${u.name} (${u.email}) ===`);
    console.log("  semesterGpas:", JSON.stringify(u.academicProfile?.semesterGpas));
    console.log("  currentSemester:", u.academicProfile?.currentSemester);
    console.log("  currentCgpa:", u.academicProfile?.currentCgpa);
    console.log("  highestCgpa:", u.academicProfile?.highestCgpa);
    console.log("  averageCgpa:", u.academicProfile?.averageCgpa);
    console.log("  predictedCgpa:", u.academicProfile?.predictedCgpa);
  }
  process.exit(0);
}
run();
