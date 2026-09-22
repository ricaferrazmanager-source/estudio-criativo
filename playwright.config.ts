import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./apps/web/test",
  use: { baseURL: "http://127.0.0.1:3100", browserName: "chromium", headless: true },
  reporter: "list",
  outputDir: "node_modules/.cache/playwright-results",
  webServer: [
    { command: "pnpm --filter @estudio-criativo/api dev", url: "http://127.0.0.1:8787/health", reuseExistingServer: !process.env.CI, timeout: 60000 },
    { command: "node apps/web/test/supabase-mock.mjs", url: "http://127.0.0.1:54329/ready", reuseExistingServer: false, timeout: 30000 },
    { command: "pnpm --filter @estudio-criativo/web build && pnpm --filter @estudio-criativo/web exec next start --hostname 127.0.0.1 --port 3100", url: "http://127.0.0.1:3100/login", reuseExistingServer: false, timeout: 120000,
      env: { STUDIO_CATALOG_ENABLED: "true", NEXT_PUBLIC_SUPABASE_URL: "http://127.0.0.1:54329", NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "test-publishable-not-a-real-key", SUPABASE_SECRET_KEY: "test-secret-not-a-real-key", STUDIO_SITE_URL: "http://127.0.0.1:3100" },
    },
  ],
});