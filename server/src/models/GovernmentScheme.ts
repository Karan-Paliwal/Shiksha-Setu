import mongoose, { Schema, Document } from "mongoose";

export interface IGovernmentScheme extends Document {
  title: string;
  description: string;
  eligibility: string;
}

const GovernmentSchemeSchema = new Schema<IGovernmentScheme>(
  {
    title: {
      type: String,
      required: [true, "Scheme title is required"],
      trim: true,
    },
    description: {
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

export default mongoose.model<IGovernmentScheme>("GovernmentScheme", GovernmentSchemeSchema);
