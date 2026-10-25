import { describe, expect, it } from "vitest";
import { extractCV, MAX_CV_BYTES } from "../../lib/job-search/cv-import";
const cv =
  "Verified experience leading quality engineering, Java API automation and test strategy across business delivery teams. ";
describe("CV file import", () => {
  it("reads text without saving or sending it anywhere", async () => {
    expect(await extractCV(new File([cv], "CV.TXT"))).toBe(cv.trim());
  });
  it("rejects unsupported, empty, oversized, scanned and invalid files", async () => {
    await expect(extractCV(new File([cv], "cv.doc"))).rejects.toThrow(
      "Choose a PDF",
    );
    await expect(extractCV(new File([], "cv.txt"))).rejects.toThrow("empty");
    await expect(
      extractCV(new File([new Uint8Array(MAX_CV_BYTES + 1)], "cv.txt")),
    ).rejects.toThrow("5 MB");
    await expect(extractCV(new File(["short"], "cv.txt"))).rejects.toThrow(
      "Not enough readable text",
    );
    await expect(extractCV(new File([cv], "cv.pdf"))).rejects.toThrow(
      "valid PDF",
    );
    await expect(extractCV(new File([cv], "cv.docx"))).rejects.toThrow(
      "valid Word",
    );
    await expect(
      extractCV(new File(["A".repeat(40001)], "cv.txt")),
    ).rejects.toThrow("40,000");
  });
});
