import mongoose, { Schema, Document } from "mongoose";

export interface IAcademicTask extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  course: string;
  dueDate?: Date;
  completed: boolean;
  priority: "low" | "medium" | "high";
}

const AcademicTaskSchema = new Schema<IAcademicTask>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: 160,
    },
    course: {
      type: String,
      default: "General",
      trim: true,
      maxlength: 80,
    },
    dueDate: {
      type: Date,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
  },
  { timestamps: true }
);

export default mongoose.model<IAcademicTask>("AcademicTask", AcademicTaskSchema);
