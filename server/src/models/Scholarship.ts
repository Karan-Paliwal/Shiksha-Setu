import mongoose, { Schema, Document } from "mongoose";

export interface IScholarship extends Document {
  title: string;
  provider: string;
  description: string;
  amount: string;
  deadline: Date;
  eligibility: string;
  category: string;
  state: string;
  degree: string;
  stream: string;
  applyUrl: string;
  detailsUrl?: string;
  logo?: string;
  source: string;
  isActive: boolean;
  lastUpdated: Date;
}

const ScholarshipSchema = new Schema<IScholarship>(
  {
    title: {
      type: String,
      required: [true, "Scholarship title is required"],
      trim: true,
      index: true,
    },
    provider: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    amount: {
      type: String,
      required: true,
      trim: true,
    },
    deadline: {
      type: Date,
      required: true,
      index: true,
    },
    eligibility: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    state: {
      type: String,
      required: true,
      trim: true,
      default: "All India",
      index: true,
    },
    degree: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    stream: {
      type: String,
      required: true,
      trim: true,
      default: "Any",
      index: true,
    },
    applyUrl: {
      type: String,
      required: true,
      trim: true,
    },
    detailsUrl: {
      type: String,
      trim: true,
    },
    logo: {
      type: String,
      trim: true,
    },
    source: {
      type: String,
      required: true,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

ScholarshipSchema.index({
  title: "text",
  provider: "text",
  description: "text",
  eligibility: "text",
  category: "text",
  degree: "text",
  stream: "text",
});

export default mongoose.model<IScholarship>("Scholarship", ScholarshipSchema);
