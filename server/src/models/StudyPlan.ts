import mongoose, { Schema, Document } from "mongoose";

export interface IStudyPlan extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  description: string;
}

const StudyPlanSchema = new Schema<IStudyPlan>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export default mongoose.model<IStudyPlan>("StudyPlan", StudyPlanSchema);
