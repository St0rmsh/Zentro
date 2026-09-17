import { describe, expect, it } from "vitest";
import { uploadService } from "@/features/post-editor/services/upload.service";

describe("uploadService.validateImage", () => {
  it("accepts supported images under the size limit", () => {
    expect(uploadService.validateImage(new File(["image"], "cover.png", { type: "image/png" }))).toBeNull();
  });

  it("rejects unsupported file types and oversized images", () => {
    expect(uploadService.validateImage(new File(["video"], "clip.mp4", { type: "video/mp4" }))).toContain("image");
    const oversized = new File([new Uint8Array(5 * 1024 * 1024 + 1)], "large.jpg", { type: "image/jpeg" });
    expect(uploadService.validateImage(oversized)).toContain("5MB");
  });
});
