import mongoose, { Schema, Document } from "mongoose";

export interface IMessage {
  id: string;
  text: string;
  isAi: boolean;
  time: string;
}

export interface IAIChatHistory extends Document {
  userId: mongoose.Types.ObjectId;
  sessionId: string;
  name: string;
  messages: IMessage[];
  insights: {
    takeaways: string[];
    recommendations: string[];
  };
  mode: string;
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema = new Schema<IMessage>({
  id: { type: String, required: true },
  text: { type: String, required: true },
  isAi: { type: Boolean, required: true },
  time: { type: String, required: true },
});

const AIChatHistorySchema = new Schema<IAIChatHistory>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  sessionId: {
    type: String,
    required: true,
    index: true,
  },
  name: {
    type: String,
    required: true,
  },
  messages: [MessageSchema],
  insights: {
    takeaways: { type: [String], default: [] },
    recommendations: { type: [String], default: [] },
  },
  mode: {
    type: String,
    default: "default",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model<IAIChatHistory>("AIChatHistory", AIChatHistorySchema);
