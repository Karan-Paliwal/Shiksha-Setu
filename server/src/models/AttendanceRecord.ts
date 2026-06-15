import mongoose, { Schema, Document } from "mongoose";

export interface IAttendanceRecord extends Document {
  userId: mongoose.Types.ObjectId;
  subject: string;
  attendedClasses: number;
  totalClasses: number;
}

const AttendanceRecordSchema = new Schema<IAttendanceRecord>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    subject: {
      type: String,
      required: [true, "Subject name is required"],
      trim: true,
    },
    attendedClasses: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    totalClasses: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model<IAttendanceRecord>("AttendanceRecord", AttendanceRecordSchema);
