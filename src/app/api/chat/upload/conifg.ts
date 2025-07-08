
import { randomUUID } from "crypto";

export const config = {
  api: {
    bodyParser: false,
  },
};

export function generateUniqueFileName(originalName: string): string {
  const ext = originalName.includes('.') ? '.' + originalName.split('.').pop() : '';
  return `${Date.now()}-${randomUUID()}${ext}`;
}

export const MAX_SIZE = 2 * 1024 * 1024; // 2MB
