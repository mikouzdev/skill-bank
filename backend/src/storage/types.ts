export interface StorageService {
  save(filename: string, data: Buffer, mimeType: string): Promise<string>;
  delete(filename: string): Promise<void>;
}
