import mongoose, { Document, Schema } from "mongoose";

export interface IOpportunity extends Document {
  title: string;
  provider: string;
  amount: string;
  deadline: string;
  eligibility: string;
  link: string;
  type: "scholarship" | "scheme";
}

const OpportunitySchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    provider: { type: String, required: true },
    amount: { type: String, required: true },
    deadline: { type: String, required: true },
    eligibility: { type: String, required: true },
    link: { type: String, required: true },
    type: { type: String, enum: ["scholarship", "scheme"], required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IOpportunity>("Opportunity", OpportunitySchema);
