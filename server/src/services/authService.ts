import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/User";
import { env } from "../config/env";

// ─── Generate JWT Token ─────────────────────────────────
const generateToken = (userId: string): string => {
  return jwt.sign({ userId }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  } as jwt.SignOptions);
};

// ─── Signup ─────────────────────────────────────────────
export const signupUser = async (
  name: string,
  email: string,
  password: string
): Promise<{ user: Partial<IUser>; token: string }> => {
  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error("User with this email already exists");
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create user
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  const token = generateToken(user._id.toString());

  return {
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      profilePicture: user.profilePicture,
    },
    token,
  };
};

// ─── Login ──────────────────────────────────────────────
export const loginUser = async (
  email: string,
  password: string
): Promise<{ user: Partial<IUser>; token: string }> => {
  // Find user
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("Invalid email or password");
  }

  // Compare password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Invalid email or password");
  }

  const token = generateToken(user._id.toString());

  return {
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      profilePicture: user.profilePicture,
    },
    token,
  };
};

// ─── Get User Profile ───────────────────────────────────
export const getUserProfile = async (
  userId: string
): Promise<Partial<IUser> | null> => {
  const user = await User.findById(userId).select("-password");
  return user;
};
