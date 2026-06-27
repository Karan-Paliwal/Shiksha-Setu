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
  const users = await User.find({ email: "khush09mandal@gmail.com" }).lean();
  if (users.length > 0) {
    console.log("User:", users[0].email);
    console.log("Marksheets:", JSON.stringify(users[0].documents?.marksheets, null, 2));
    console.log("AcademicProfile:", JSON.stringify(users[0].academicProfile, null, 2));
  } else {
    // If not found, just get the last updated user
    const lastUser = await User.findOne().sort({ _id: -1 }).lean();
    console.log("Last user:", lastUser?.email);
    console.log("Marksheets:", JSON.stringify(lastUser?.documents?.marksheets, null, 2));
  }
  process.exit(0);
}
run();
