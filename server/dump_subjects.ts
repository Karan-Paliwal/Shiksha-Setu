import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./src/models/User";

dotenv.config({path: '../.env'});

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/shikshasetu");
    const users = await User.find({});
    users.forEach(user => {
      console.log(`User: ${user.name}`);
      if (user.academicProfile?.subjects) {
        console.log(JSON.stringify(user.academicProfile.subjects, null, 2));
      }
    });
  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
};

run();
