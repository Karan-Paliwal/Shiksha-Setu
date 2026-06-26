import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

// ─── useAuth Hook ────────────────────────────────────────
// Convenience hook to access auth state and actions
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
