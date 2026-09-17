import { describe, expect, it } from "vitest";
import { uploadService } from "@/features/post-editor/services/upload.service";

describe("uploadService.validateMedia", () => {
  it("accepts images and videos below 50MB", () => {
    expect(uploadService.validateMedia(new File(["image"], "cover.webp", { type: "image/webp" }))).toBeNull();
    expect(uploadService.validateMedia(new File(["video"], "clip.mp4", { type: "video/mp4" }))).toBeNull();
  });

  it("rejects unsupported types and oversized media", () => {
    expect(uploadService.validateMedia(new File(["text"], "notes.txt", { type: "text/plain" }))).toContain("image or video");
    const oversized = new File([new Uint8Array(50 * 1024 * 1024 + 1)], "large.mp4", { type: "video/mp4" });
    expect(uploadService.validateMedia(oversized)).toContain("50MB");
  });
});
