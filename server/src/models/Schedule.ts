import mongoose, { Schema, Document } from "mongoose";

export interface IScheduleClass {
  courseName: string;
  dayOfWeek: "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday";
  startTime: string; // HH:MM
  endTime: string;   // HH:MM
  location: string;
}

export interface ISchedule extends Document {
  userId: mongoose.Types.ObjectId;
  classes: IScheduleClass[];
  updatedAt: Date;
}

const ScheduleClassSchema = new Schema<IScheduleClass>({
  courseName: { type: String, required: true },
  dayOfWeek: { 
    type: String, 
    required: true,
    enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
  },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  location: { type: String, default: "TBA" }
});

const ScheduleSchema = new Schema<ISchedule>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  classes: [ScheduleClassSchema],
  updatedAt: {
    type: Date,
    default: Date.now,
  }
});

export default mongoose.model<ISchedule>("Schedule", ScheduleSchema);
