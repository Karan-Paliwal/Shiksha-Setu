import mongoose, { Schema, Document } from "mongoose";

export interface IInternshipApplication extends Document {
  userId: mongoose.Types.ObjectId;
  company: string;
  status: "applied" | "interviewing" | "offered" | "rejected" | "accepted";
}

const InternshipApplicationSchema = new Schema<IInternshipApplication>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    company: {
      type: String,
      required: [true, "Company name is required"],
      trim: true,
    },
    status: {
      type: String,
      enum: ["applied", "interviewing", "offered", "rejected", "accepted"],
      default: "applied",
    },
  },
  { timestamps: true }
);

export default mongoose.model<IInternshipApplication>(
  "InternshipApplication",
  InternshipApplicationSchema
);
