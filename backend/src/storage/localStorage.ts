import fs from "fs/promises";
import path from "path";
import { type StorageService } from "./types.js";

const UPLOAD_DIR = path.resolve("uploads/profile_pictures");

/**
 * Handles storing profile pictures locally in the backend. Pictures are
 * stored in `UPLOAD_DIR` and are accessible in
 * `/static/picture_name.extension`.
 *
 * @export
 * @class LocalStorageService
 * @implements {StorageService}
 */
export class LocalStorageService implements StorageService {
  async save(filename: string, data: Buffer): Promise<string> {
    const filePath = path.join(UPLOAD_DIR, filename);

    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, data);

    return `/static/${filename}`;
  }

  async delete(filename: string) {
    const filePath = path.join(UPLOAD_DIR, filename);
    await fs.unlink(filePath).catch(() => {});
  }
}
