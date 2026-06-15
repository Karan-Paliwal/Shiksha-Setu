// ─── Utility Helpers ─────────────────────────────────────

/**
 * Wraps an async Express handler to catch errors automatically.
 * Usage: router.get("/path", asyncHandler(myController));
 */
import { Request, Response, NextFunction } from "express";

export const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

/**
 * Simple response formatter
 */
export const formatResponse = (data: any, message: string = "Success") => {
  return {
    success: true,
    message,
    data,
    timestamp: new Date().toISOString(),
  };
};
