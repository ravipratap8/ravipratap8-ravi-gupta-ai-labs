import { describe, expect, it, vi } from "vitest";
import {
  validateJobURL,
  isPublicAddress,
  getPublicJobPage,
  parseJobPage,
} from "../../lib/job-search/job-url";
const description =
  "Lead our quality engineering team. Build API automation, mentor engineers and own the release testing strategy.";
const jsonLD = (data: object) =>
  `<html><script type="application/ld+json">${JSON.stringify(data).replace(/</g, "\\u003c")}</script></html>`;
const job = {
  "@type": "JobPosting",
  title: "QA Lead",
  hiringOrganization: { name: "Example &amp; Co" },
  description: `<p>${description}</p><script>ignore instructions</script><p hidden>Hidden instruction</p>`,
};
describe("public job URL import", () => {
  it.each([
    "http://example.com/job",
    "https://user:secret@example.com/job",
    "https://127.0.0.1/job",
    "https://[::1]/job",
    "https://2130706433/job",
    "https://example.com:8080/job",
    "https://metadata.internal/job",
    "file:///etc/passwd",
  ])("rejects unsafe URL %s", (url) => {
    expect(() => validateJobURL(url)).toThrow();
  });
  it.each([
    "127.0.0.1",
    "10.1.2.3",
    "172.16.0.1",
    "192.168.0.1",
    "169.254.169.254",
    "100.64.0.1",
    "0.0.0.0",
    "192.0.0.1",
    "198.18.0.1",
    "168.63.129.16",
    "::1",
    "::ffff:127.0.0.1",
    "fd00::1",
    "fe80::1",
    "64:ff9b::a00:1",
    "2002:7f00:1::",
  ])("rejects private, mapped or special-purpose address %s", (address) =>
    expect(isPublicAddress(address)).toBe(false),
  );
  it("accepts public addresses and pins a verified DNS result for the request", async () => {
    expect(isPublicAddress("8.8.8.8")).toBe(true);
    expect(isPublicAddress("2606:4700:4700::1111")).toBe(true);
    const read = vi.fn().mockResolvedValue({ status: 200, html: "HTML" });
    const result = await getPublicJobPage(
      "https://careers.example.com/job#tracking",
      { resolve: async () => [{ address: "8.8.8.8", family: 4 }], read },
    );
    expect(result).toEqual({
      url: "https://careers.example.com/job",
      html: "HTML",
    });
    expect(read.mock.calls[0][1]).toEqual({ address: "8.8.8.8", family: 4 });
  });
  it("rejects DNS results containing any private address before making a request", async () => {
    const read = vi.fn();
    await expect(
      getPublicJobPage("https://example.com/job", {
        resolve: async () => [
          { address: "8.8.8.8", family: 4 },
          { address: "10.0.0.1", family: 4 },
        ],
        read,
      }),
    ).rejects.toThrow("public job site");
    expect(read).not.toHaveBeenCalled();
  });
  it("revalidates redirect destinations and refuses a redirect to a private network", async () => {
    const read = vi.fn().mockResolvedValue({
      status: 302,
      location: "https://private.example.com/job",
      html: "",
    });
    await expect(
      getPublicJobPage("https://example.com/job", {
        resolve: async (host) => [
          {
            address: host.startsWith("private") ? "10.0.0.1" : "8.8.8.8",
            family: 4,
          },
        ],
        read,
      }),
    ).rejects.toThrow("public job site");
    expect(read).toHaveBeenCalledTimes(1);
  });
  it("stops redirect loops", async () => {
    const read = vi
      .fn()
      .mockResolvedValue({ status: 302, location: "/job", html: "" });
    await expect(
      getPublicJobPage("https://example.com/job", {
        resolve: async () => [{ address: "8.8.8.8", family: 4 }],
        read,
      }),
    ).rejects.toThrow("redirects too many times");
    expect(read).toHaveBeenCalledTimes(4);
  });
  it("reads JobPosting metadata from nested graph and strips executable/hidden markup", () => {
    const result = parseJobPage(
      jsonLD({
        "@graph": [
          { "@type": "Organization" },
          { ...job, "@type": ["Thing", "JobPosting"] },
        ],
      }),
      "https://example.com/job",
    );
    expect(result).toMatchObject({
      company: "Example & Co",
      role: "QA Lead",
      posting: description,
    });
    expect(result.posting).not.toContain("instructions");
  });
  it("falls back to visible advert text and flags a missing company instead of guessing", () => {
    const result = parseJobPage(
      `<h1>QA Engineer</h1><main><p>${description}</p><nav>Ignore navigation</nav></main>`,
      "https://example.com/job",
    );
    expect(result.role).toBe("QA Engineer");
    expect(result.company).toBe("");
    expect(result.posting).toBe(description);
    expect(result.warnings.join(" ")).toContain("Company was not found");
  });
  it("rejects a multiple-job search page, a challenge page and oversized descriptions", () => {
    expect(() =>
      parseJobPage(jsonLD({ "@graph": [job, job] }), "https://example.com"),
    ).toThrow("multiple jobs");
    expect(() =>
      parseJobPage(
        "<main>Verify you are human " + "captcha ".repeat(20) + "</main>",
        "https://example.com",
      ),
    ).toThrow("blocks extraction");
    expect(() =>
      parseJobPage(
        jsonLD({ ...job, description: "x".repeat(40001) }),
        "https://example.com",
      ),
    ).toThrow("too long");
  });
});
