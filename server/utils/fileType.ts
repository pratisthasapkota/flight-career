import fs from "fs";

export type ResumeFileType = "pdf" | "doc" | "docx" | "jpeg" | "png";

export const RESUME_CONTENT_TYPES: Record<ResumeFileType, string> = {
  pdf: "application/pdf",
  doc: "application/msword",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  jpeg: "image/jpeg",
  png: "image/png",
};

const PNG_MAGIC = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

export function sniffFileType(filePath: string): ResumeFileType | null {
  let fd: number | null = null;
  try {
    fd = fs.openSync(filePath, "r");
    const buf = Buffer.alloc(512);
    const bytesRead = fs.readSync(fd, buf, 0, buf.length, 0);
    const head = buf.subarray(0, bytesRead);
    if (bytesRead >= 4 && head[0] === 0x25 && head[1] === 0x50 && head[2] === 0x44 && head[3] === 0x46) {
      return "pdf";
    }
    if (bytesRead >= 3 && head[0] === 0xff && head[1] === 0xd8 && head[2] === 0xff) {
      return "jpeg";
    }
    if (bytesRead >= 8 && head.subarray(0, 8).equals(PNG_MAGIC)) {
      return "png";
    }
    if (bytesRead >= 4 && head[0] === 0xd0 && head[1] === 0xcf && head[2] === 0x11 && head[3] === 0xe0) {
      return "doc";
    }
    if (bytesRead >= 4 && head[0] === 0x50 && head[1] === 0x4b && head[2] === 0x03 && head[3] === 0x04) {
      return "docx";
    }
    return null;
  } catch {
    return null;
  } finally {
    if (fd !== null) {
      try {
        fs.closeSync(fd);
      } catch {
        // ignore
      }
    }
  }
}