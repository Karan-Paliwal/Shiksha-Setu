import mongoose, { Schema, Document } from "mongoose";

export interface IAIChatHistory extends Document {
  userId: mongoose.Types.ObjectId;
  prompt: string;
  response: string;
  createdAt: Date;
}

const AIChatHistorySchema = new Schema<IAIChatHistory>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  prompt: {
    type: String,
    required: [true, "Prompt is required"],
  },
  response: {
    type: String,
    required: [true, "Response is required"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model<IAIChatHistory>("AIChatHistory", AIChatHistorySchema);
