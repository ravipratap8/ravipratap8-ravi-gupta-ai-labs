export const MAX_CV_BYTES = 5 * 1024 * 1024;
export const MAX_CV_CHARS = 40000;

export async function extractCV(file: File): Promise<string> {
  if (!file.size) throw new Error("This file is empty. Choose your CV again.");
  if (file.size > MAX_CV_BYTES)
    throw new Error("Choose a CV smaller than 5 MB.");
  const extension = file.name.split(".").pop()?.toLowerCase();
  if (!["pdf", "docx", "txt"].includes(extension || ""))
    throw new Error(
      "Choose a PDF, Word (.docx) or text (.txt) file. Save older .doc files as .docx first.",
    );
  const buffer = await file.arrayBuffer();
  let text = "";
  if (extension === "txt") {
    text = new TextDecoder("utf-8", { fatal: true }).decode(buffer);
  } else if (extension === "docx") {
    const bytes = new Uint8Array(buffer);
    if (bytes[0] !== 0x50 || bytes[1] !== 0x4b)
      throw new Error("This does not look like a valid Word document.");
    const mammoth = await import("mammoth/mammoth.browser");
    text = (await mammoth.extractRawText({ arrayBuffer: buffer })).value;
  } else {
    if (!new TextDecoder().decode(buffer.slice(0, 1024)).includes("%PDF-"))
      throw new Error("This does not look like a valid PDF.");
    const pdfjs = await import("pdfjs-dist/build/pdf.mjs");
    pdfjs.GlobalWorkerOptions.workerSrc = new URL(
      "pdfjs-dist/build/pdf.worker.min.mjs",
      import.meta.url,
    ).toString();
    const task = pdfjs.getDocument({
      data: new Uint8Array(buffer),
      isEvalSupported: false,
    });
    try {
      const pdf = await task.promise;
      if (pdf.numPages > 20)
        throw new Error("Choose a CV with 20 pages or fewer.");
      const pages: string[] = [];
      for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
        const page = await pdf.getPage(pageNumber);
        const content = await page.getTextContent();
        pages.push(
          content.items
            .map((item) =>
              "str" in item ? item.str + (item.hasEOL ? "\n" : " ") : "",
            )
            .join(""),
        );
        page.cleanup();
      }
      text = pages.join("\n\n");
    } finally {
      await task.destroy();
    }
  }
  text = text.replace(/\r\n/g, "\n").replace(/\0/g, "").trim();
  if (text.length < 80)
    throw new Error(
      "Not enough readable text was found. For scanned or image-only CVs, use a text-based PDF or Word file, or paste the text below.",
    );
  if (text.length > MAX_CV_CHARS)
    throw new Error(
      "This CV exceeds 40,000 characters. Use a shorter document or paste the relevant text below.",
    );
  return text;
}
