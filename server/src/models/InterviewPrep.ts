import mongoose, { Schema, Document } from "mongoose";

export interface IInterviewAttempt {
  mode: "coding" | "behavioral" | "mock";
  problemId?: string;
  title: string;
  category: string;
  score: number;
  language?: string;
  difficulty?: string;
  feedback: string;
  strengths: string[];
  improvements: string[];
  answerSnippet?: string;
  createdAt: Date;
}

export interface IMockInterview {
  mentorName: string;
  company: string;
  scheduledAt: Date;
  status: "scheduled" | "completed" | "cancelled";
}

export interface ICommunityPost {
  authorName: string;
  text: string;
  helpfulCount: number;
  createdAt: Date;
}

export interface IInterviewPrep extends Document {
  userId: mongoose.Types.ObjectId;
  attempts: IInterviewAttempt[];
  mocks: IMockInterview[];
  posts: ICommunityPost[];
  skills: {
    technicalAccuracy: number;
    communication: number;
    problemSolving: number;
  };
}

const InterviewAttemptSchema = new Schema<IInterviewAttempt>({
  mode: {
    type: String,
    enum: ["coding", "behavioral", "mock"],
    default: "coding",
  },
  problemId: { type: String, default: "" },
  title: { type: String, required: true, trim: true },
  category: { type: String, default: "Coding", trim: true },
  score: { type: Number, required: true, min: 0, max: 100 },
  language: { type: String, default: "JavaScript" },
  difficulty: { type: String, default: "Medium" },
  feedback: { type: String, default: "" },
  strengths: { type: [String], default: [] },
  improvements: { type: [String], default: [] },
  answerSnippet: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
});

const MockInterviewSchema = new Schema<IMockInterview>({
  mentorName: { type: String, required: true, trim: true },
  company: { type: String, default: "Mentor Network", trim: true },
  scheduledAt: { type: Date, required: true },
  status: {
    type: String,
    enum: ["scheduled", "completed", "cancelled"],
    default: "scheduled",
  },
});

const CommunityPostSchema = new Schema<ICommunityPost>({
  authorName: { type: String, default: "Student", trim: true },
  text: { type: String, required: true, trim: true, maxlength: 600 },
  helpfulCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

const InterviewPrepSchema = new Schema<IInterviewPrep>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    attempts: { type: [InterviewAttemptSchema], default: [] },
    mocks: { type: [MockInterviewSchema], default: [] },
    posts: { type: [CommunityPostSchema], default: [] },
    skills: {
      technicalAccuracy: { type: Number, default: 72 },
      communication: { type: Number, default: 65 },
      problemSolving: { type: Number, default: 70 },
    },
  },
  { timestamps: true }
);

export default mongoose.model<IInterviewPrep>("InterviewPrep", InterviewPrepSchema);
