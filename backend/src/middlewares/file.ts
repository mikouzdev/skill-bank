import type { Request, Response, NextFunction } from "express";
import multer from "multer";

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MiB
  },
});

export const uploadFile =
  (fieldName: string) => (req: Request, res: Response, next: NextFunction) => {
    upload.single(fieldName)(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_UNEXPECTED_FILE") {
          return res.status(400).json({
            message: "Unexpected field name for a file",
          });
        }

        if (err.code === "LIMIT_FILE_SIZE") {
          return res.status(400).json({
            message: "File is too large",
          });
        }

        return res.status(400).json({ message: err.message });
      }

      if (err) {
        return res.status(500).json({ message: "Upload failed" });
      }

      next();
    });
  };
