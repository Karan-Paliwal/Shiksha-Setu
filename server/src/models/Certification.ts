import mongoose, { Document, Schema } from 'mongoose';

export interface ICertification extends Document {
  userId: mongoose.Types.ObjectId;
  type: 'internal' | 'external';
  title: string;
  issuer: string;
  issueDate: Date;
  credentialUrl?: string;
  credentialId: string;
  playlistId?: string;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CertificationSchema = new Schema<ICertification>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['internal', 'external'], required: true },
    title: { type: String, required: true },
    issuer: { type: String, required: true },
    issueDate: { type: Date, default: Date.now },
    credentialUrl: { type: String },
    credentialId: { type: String, required: true },
    playlistId: { type: String },
    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Compound index to ensure uniqueness of credentialId per certification
CertificationSchema.index({ credentialId: 1 }, { unique: true });
CertificationSchema.index({ userId: 1 });

export default mongoose.model<ICertification>('Certification', CertificationSchema);
