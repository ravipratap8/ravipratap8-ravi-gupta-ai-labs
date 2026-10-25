import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/job-search/browser",
  testMatch: "*.spec.ts",
  use: {
    baseURL: "http://127.0.0.1:4178",
    screenshot: "only-on-failure",
    launchOptions: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH
      ? {
          executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH,
          args: ["--no-sandbox", "--disable-dev-shm-usage"],
        }
      : {},
  },
  webServer: {
    command:
      "npx vite --config tests/job-search/browser/vite.config.ts --host 127.0.0.1 --port 4178",
    url: "http://127.0.0.1:4178",
    reuseExistingServer: false,
  },
});
