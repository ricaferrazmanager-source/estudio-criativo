import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./apps/web/test",
  use: { baseURL: "http://127.0.0.1:3000", browserName: "chromium", headless: true },
  reporter: "list",
  outputDir: "node_modules/.cache/playwright-results",
  webServer: [
    { command: "pnpm --filter @estudio-criativo/api dev", url: "http://127.0.0.1:8787/health", reuseExistingServer: !process.env.CI, timeout: 60000 },
    { command: "pnpm --filter @estudio-criativo/web dev", url: "http://127.0.0.1:3000", reuseExistingServer: !process.env.CI, timeout: 60000 },
  ],
});
