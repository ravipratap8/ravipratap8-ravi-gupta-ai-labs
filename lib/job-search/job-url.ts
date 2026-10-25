import { lookup } from "node:dns/promises";
import { request } from "node:https";
import { isIP } from "node:net";
import ipaddr from "ipaddr.js";
import { load } from "cheerio/slim";

const MAX_BYTES = 2 * 1024 * 1024;
export class JobImportError extends Error {}
export type ImportedJob = {
  company: string;
  role: string;
  posting: string;
  url: string;
  warnings: string[];
};
type Address = { address: string; family: number };
type Page = { status: number; location?: string; html: string };
export function validateJobURL(raw: string): URL {
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    throw new JobImportError("Enter a complete HTTPS job-advert URL.");
  }
  const host = url.hostname.toLowerCase();
  if (
    url.protocol !== "https:" ||
    (url.port && url.port !== "443") ||
    url.username ||
    url.password ||
    isIP(host.replace(/^\[|\]$/g, "")) ||
    !host.includes(".") ||
    /\.(localhost|local|internal|test|invalid)$/.test(host) ||
    host === "localhost" ||
    raw.length > 2000
  ) {
    throw new JobImportError(
      "Use a public HTTPS job page, without a custom port or sign-in credentials.",
    );
  }
  url.hash = "";
  return url;
}
export function isPublicAddress(address: string): boolean {
  try {
    const parsed = ipaddr.process(address);
    if (parsed.range() !== "unicast") return false;
    if (parsed.kind() === "ipv6")
      return parsed.match(ipaddr.parse("2000::"), 3);
    // Additional public-looking special-purpose and cloud platform addresses.
    return !["192.0.0.0/24", "192.88.99.0/24", "168.63.129.16/32"].some(
      (cidr) => parsed.match(ipaddr.parseCIDR(cidr)),
    );
  } catch {
    return false;
  }
}
async function resolvePublic(hostname: string): Promise<Address[]> {
  let timer: ReturnType<typeof setTimeout>;
  try {
    return await Promise.race([
      lookup(hostname, { all: true, verbatim: true }),
      new Promise<never>((_, reject) => {
        timer = setTimeout(
          () =>
            reject(
              new JobImportError(
                "The job site took too long to respond. Try again or paste the advert.",
              ),
            ),
          4000,
        );
      }),
    ]);
  } finally {
    clearTimeout(timer!);
  }
}
function readPinnedPage(
  url: URL,
  address: Address,
  signal: AbortSignal,
): Promise<Page> {
  return new Promise((resolve, reject) => {
    const req = request(
      url,
      {
        method: "GET",
        agent: false,
        family: address.family,
        signal,
        // Pin the verified DNS result while retaining TLS certificate/hostname verification.
        lookup: (_hostname, _options, callback) =>
          callback(null, address.address, address.family),
        headers: {
          "User-Agent": "RaviGuptaJobImport/1.0",
          Accept: "text/html,application/xhtml+xml",
          "Accept-Encoding": "identity",
        },
      },
      (response) => {
        const status = response.statusCode || 0;
        if ([301, 302, 303, 307, 308].includes(status)) {
          response.resume();
          resolve({ status, location: response.headers.location, html: "" });
          return;
        }
        if (status !== 200) {
          response.resume();
          reject(
            new JobImportError(
              status === 404 || status === 410
                ? "This advert is unavailable or has expired. Check the link or paste the advert."
                : "This site blocked access or requires sign-in. Open the advert and paste its text instead.",
            ),
          );
          return;
        }
        if (
          !/text\/html|application\/xhtml\+xml/i.test(
            response.headers["content-type"] || "",
          )
        ) {
          response.destroy();
          reject(
            new JobImportError(
              "This URL does not return a readable job web page. Paste the advert instead.",
            ),
          );
          return;
        }
        if (
          response.headers["content-encoding"] &&
          response.headers["content-encoding"] !== "identity"
        ) {
          response.destroy();
          reject(
            new JobImportError(
              "This site returned an unsupported response. Paste the advert instead.",
            ),
          );
          return;
        }
        let bytes = 0;
        const chunks: Buffer[] = [];
        response.on("data", (chunk: Buffer) => {
          bytes += chunk.length;
          if (bytes > MAX_BYTES) {
            response.destroy();
            reject(
              new JobImportError(
                "This page is too large to import. Paste just the job advert instead.",
              ),
            );
          } else chunks.push(chunk);
        });
        response.on("end", () =>
          resolve({ status, html: Buffer.concat(chunks).toString("utf8") }),
        );
        response.on("error", reject);
      },
    );
    req.on("error", reject);
    req.end();
  });
}
export async function getPublicJobPage(
  raw: string,
  dependencies = { resolve: resolvePublic, read: readPinnedPage },
) {
  let url = validateJobURL(raw);
  const signal = AbortSignal.timeout(20000);
  for (let hop = 0; hop <= 3; hop++) {
    signal.throwIfAborted();
    const addresses = await dependencies.resolve(url.hostname);
    if (
      !addresses.length ||
      addresses.some((record) => !isPublicAddress(record.address))
    )
      throw new JobImportError(
        "This URL does not resolve to a public job site.",
      );
    const pinned =
      addresses.find((record) => record.family === 4) || addresses[0];
    const response = await dependencies.read(url, pinned, signal);
    if ([301, 302, 303, 307, 308].includes(response.status)) {
      if (!response.location || hop === 3)
        throw new JobImportError(
          "The job link redirects too many times. Use the final advert URL.",
        );
      url = validateJobURL(new URL(response.location, url).href);
      continue;
    }
    return { html: response.html, url: url.href };
  }
  throw new JobImportError("Unable to import this job link.");
}
function plainText(html: string): string {
  const $ = load(html);
  $(
    'script,style,noscript,iframe,svg,nav,footer,header,[hidden],[aria-hidden="true"],[style*="display:none"],[style*="display: none"],[style*="visibility:hidden"],[style*="visibility: hidden"]',
  ).remove();
  $("br").replaceWith("\n");
  $("p,div,li,h1,h2,h3,h4,section").append("\n");
  return $.root()
    .text()
    .replace(/\u00a0/g, " ")
    .replace(/[ \t]+/g, " ")
    .replace(/ *\n */g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
export function parseJobPage(html: string, url: string): ImportedJob {
  const $ = load(html);
  const candidates: Record<string, unknown>[] = [];
  $('script[type="application/ld+json"]').each((_, script) => {
    try {
      const queue: unknown[] = [JSON.parse($(script).text())];
      for (let count = 0; queue.length && count < 2000; count++) {
        const node = queue.shift();
        if (!node || typeof node !== "object") continue;
        if (Array.isArray(node)) {
          queue.push(...node);
          continue;
        }
        const item = node as Record<string, unknown>;
        const types = Array.isArray(item["@type"])
          ? item["@type"]
          : [item["@type"]];
        if (types.includes("JobPosting")) candidates.push(item);
        else
          queue.push(
            ...Object.values(item).filter((v) => v && typeof v === "object"),
          );
      }
    } catch {
      /* Fall back to visible advert content, never execute page scripts. */
    }
  });
  if (candidates.length > 1)
    throw new JobImportError(
      "This looks like a page with multiple jobs. Open one specific job advert and import its URL.",
    );
  const data = candidates[0];
  let role = typeof data?.title === "string" ? plainText(data.title) : "";
  const org = data?.hiringOrganization;
  let company =
    typeof org === "string"
      ? plainText(org)
      : org &&
          typeof org === "object" &&
          "name" in org &&
          typeof org.name === "string"
        ? plainText(org.name)
        : "";
  let posting =
    typeof data?.description === "string" ? plainText(data.description) : "";
  const warnings: string[] = [];
  if (!posting) {
    const content = $(
      '[data-automation="jobAdDetails"], [data-test="job-description"], [itemprop="description"], .job-description, #job-description, main article, article, main',
    ).first();
    posting = plainText(content.html() || "");
    role ||= plainText($("h1").first().html() || "");
    company ||= plainText(
      $('[itemprop="hiringOrganization"] [itemprop="name"]').first().html() ||
        "",
    );
    warnings.push(
      "Imported visible page text. Check that the entire advert was captured.",
    );
  }
  if (
    posting.length < 80 ||
    (!data &&
      /captcha|verify you are human|access denied|sign in to continue|enable javascript/i.test(
        posting,
      ))
  )
    throw new JobImportError(
      "This page needs sign-in, blocks extraction, or loads its advert with JavaScript. Paste the visible job advert instead.",
    );
  if (role.length > 200 || company.length > 200 || posting.length > 40000)
    throw new JobImportError(
      "The extracted content is too long. Paste just the relevant job advert instead.",
    );
  if (!role)
    warnings.push("Role title was not found. Fill it in before saving.");
  if (!company)
    warnings.push("Company was not found. Fill it in before saving.");
  warnings.push(
    "Review imported details against the original advert before saving.",
  );
  return { company, role, posting, url, warnings };
}
export async function importJobURL(url: string): Promise<ImportedJob> {
  try {
    const page = await getPublicJobPage(url);
    return parseJobPage(page.html, page.url);
  } catch (error) {
    if (error instanceof JobImportError) throw error;
    throw new JobImportError(
      "Could not read this job site. It may block imports or be temporarily unavailable. Open the page and paste the advert instead.",
    );
  }
}
