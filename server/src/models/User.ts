import mongoose, { Schema, Document } from "mongoose";

export interface IAcademicProfile {
  currentCgpa: number;
  targetCgpa: number;
  creditsEarned: number;
  totalCredits: number;
  currentSemester: number;
}

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  isProfileComplete: boolean;
  academicProfile?: IAcademicProfile;
  createdAt: Date;
}

const UserSchema = new Schema<IUser>({
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
    minlength: 2,
    maxlength: 100,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: 6,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  isProfileComplete: {
    type: Boolean,
    default: false,
  },
  academicProfile: {
    currentCgpa: { type: Number, default: 0 },
    targetCgpa: { type: Number, default: 0 },
    creditsEarned: { type: Number, default: 0 },
    totalCredits: { type: Number, default: 0 },
    currentSemester: { type: Number, default: 1 },
  }
});

export default mongoose.model<IUser>("User", UserSchema);
