import mongoose, { Schema, Document } from 'mongoose';

export interface ISavedCourse extends Document {
  userId: mongoose.Types.ObjectId;
  playlistId: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  channelTitle: string;
  savedAt: Date;
}

const SavedCourseSchema = new Schema<ISavedCourse>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  playlistId: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  thumbnailUrl: {
    type: String,
    required: true,
  },
  channelTitle: {
    type: String,
    required: true,
  },
  savedAt: {
    type: Date,
    default: Date.now,
  },
});

// Ensure a user can only save a specific course once
SavedCourseSchema.index({ userId: 1, playlistId: 1 }, { unique: true });

export default mongoose.model<ISavedCourse>('SavedCourse', SavedCourseSchema);
