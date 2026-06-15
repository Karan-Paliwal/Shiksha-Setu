import mongoose, { Schema, Document } from "mongoose";

export interface IScholarship extends Document {
  title: string;
  amount: string;
  eligibility: string;
}

const ScholarshipSchema = new Schema<IScholarship>(
  {
    title: {
      type: String,
      required: [true, "Scholarship title is required"],
      trim: true,
    },
    amount: {
      type: String,
      required: true,
    },
    eligibility: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model<IScholarship>("Scholarship", ScholarshipSchema);
