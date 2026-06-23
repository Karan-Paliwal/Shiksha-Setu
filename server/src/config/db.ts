import mongoose from "mongoose";
import { env } from "./env";
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoServer: MongoMemoryServer;

export const connectDB = async (): Promise<void> => {
  try {
    let uri = env.MONGO_URI;

    if (uri.includes('localhost') || uri.includes('127.0.0.1')) {
      try {
        await mongoose.connect(uri, { serverSelectionTimeoutMS: 2000 });
        console.log(`✅ MongoDB Connected to local DB: ${mongoose.connection.host}`);
        return;
      } catch (e) {
        console.log(`⚠️ Local MongoDB not found on ${uri}. Starting in-memory MongoDB...`);
        mongoServer = await MongoMemoryServer.create();
        uri = mongoServer.getUri();
      }
    }
    
    const conn = await mongoose.connect(uri);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error);
    process.exit(1);
  }
};
