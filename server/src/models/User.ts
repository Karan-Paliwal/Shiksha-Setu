import mongoose, { Schema, Document } from "mongoose";

export interface IAcademicProfile {
  currentCgpa: number;
  targetCgpa: number;
  creditsEarned: number;
  totalCredits: number;
  currentSemester: number;
  predictedCgpa?: number;
  highestCgpa?: number;
  averageCgpa?: number;
  semesterGpas?: number[];
  subjects?: { name: string; score: number }[];
}

export interface IProfileDetails {
  category?: string;
  income?: string;
  interests?: string;
}

export interface IDocuments {
  marksheets: Map<string, string>; // Maps semester to url
  timetable?: string;
}

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  isProfileComplete: boolean;
  academicProfile?: IAcademicProfile;
  profileDetails?: IProfileDetails;
  documents?: IDocuments;
  profilePicture?: string;
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
    predictedCgpa: { type: Number, default: 0 },
    highestCgpa: { type: Number, default: 0 },
    averageCgpa: { type: Number, default: 0 },
    semesterGpas: { type: [Number], default: [] },
    subjects: [
      {
        name: { type: String, required: true },
        score: { type: Number, required: true },
      }
    ]
  },
  profileDetails: {
    category: { type: String, default: "" },
    income: { type: String, default: "" },
    interests: { type: String, default: "" },
  },
  documents: {
    marksheets: { type: Map, of: String, default: {} },
    timetable: { type: String, default: "" },
  },
  profilePicture: {
    type: String,
    default: "",
  }
});

export default mongoose.model<IUser>("User", UserSchema);
