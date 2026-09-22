import { expect, test } from "@playwright/test";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
test("catálogo desativado recusa leitura e escrita mesmo com login", async ({ page }) => {
  const server = spawn(process.execPath, [fileURLToPath(new URL("../node_modules/next/dist/bin/next", import.meta.url)), "start", "--hostname", "127.0.0.1", "--port", "3111"], {
    cwd: fileURLToPath(new URL("../", import.meta.url)), windowsHide: true, stdio: "ignore",
    env: { ...process.env, STUDIO_CATALOG_ENABLED: "", STUDIO_SITE_URL: "http://127.0.0.1:3111", NEXT_PUBLIC_SUPABASE_URL: "http://127.0.0.1:54329", NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "test-publishable-not-a-real-key", SUPABASE_SECRET_KEY: "" },
  });
  try {
    await expect.poll(async () => { try { return (await fetch("http://127.0.0.1:3111/login")).status; } catch { return 0; } }, { timeout: 15000 }).toBe(200);
    await page.goto("http://127.0.0.1:3111/login");
    await page.getByLabel("E-mail", { exact: true }).fill("flag@example.test");
    await page.getByLabel("Senha", { exact: true }).fill("example-test-password");
    await page.getByRole("button", { name: "Entrar", exact: true }).click();
    await expect(page).toHaveURL("http://127.0.0.1:3111/");
    for (const response of [await page.request.get("http://127.0.0.1:3111/api/products"), await page.request.post("http://127.0.0.1:3111/api/products", { headers: { Origin: "http://127.0.0.1:3111" }, data: {} })]) {
      expect(response.status()).toBe(503);
      expect(await response.json()).toEqual({ error: "O salvamento ainda não está ativado." });
    }
  } finally { server.kill(); }
});
