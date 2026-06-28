import mongoose, { Document, Schema } from 'mongoose';

export interface ICourseProgress extends Document {
  userId: mongoose.Types.ObjectId;
  playlistId: string;
  completedVideoIds: string[];
  createdAt: Date;
  updatedAt: Date;
}

const CourseProgressSchema = new Schema<ICourseProgress>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    playlistId: { type: String, required: true },
    completedVideoIds: [{ type: String }],
  },
  { timestamps: true }
);

// Compound index to ensure a user has only one progress document per playlist
CourseProgressSchema.index({ userId: 1, playlistId: 1 }, { unique: true });

export default mongoose.model<ICourseProgress>('CourseProgress', CourseProgressSchema);
