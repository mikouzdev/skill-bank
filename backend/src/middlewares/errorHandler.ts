import type { NextFunction, Request, Response } from "express";

export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (res.headersSent) {
    return next(err);
  }
  console.error(err); // TODO: to log file at some point, clean up 500's to get rid of lot of try-cathces

  res.status(500).json({
    message: "Internal server error",
  });
}
