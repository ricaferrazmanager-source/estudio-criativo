import { expect, test } from "@playwright/test";

async function login(page: import("@playwright/test").Page, email = "member@example.test") {
  await page.goto("/login");
  await page.getByLabel("E-mail", { exact: true }).fill(email);
  await page.getByLabel("Senha", { exact: true }).fill("example-test-password");
  await page.getByRole("button", { name: "Entrar", exact: true }).click();
}

test("bloqueia a página e a consulta sem sessão", async ({ page, request }) => {
  await page.goto("/");
  await expect(page).toHaveURL(/\/login$/);
  expect((await request.get("/api/health")).status()).toBe(401);
});
test("explica erro de login sem revelar existência de conta", async ({ page }) => {
  await login(page, "wrong@example.test");
  await expect(page.locator("form").getByRole("alert")).toContainText("Não foi possível entrar");
});
test("convidado entra, navega e sai", async ({ page }) => {
  await login(page);
  await expect(page.getByRole("heading", { name: "Seu estúdio começa aqui." })).toBeVisible();
  await page.getByRole("button", { name: "Sair", exact: true }).click();
  await expect(page).toHaveURL(/\/login$/);
  await page.goto("/");
  await expect(page).toHaveURL(/\/login$/);
});
test("conta sem convite não entra mesmo autenticada", async ({ page }) => {
  await login(page, "uninvited@example.test");
  await expect(page.locator("form").getByRole("alert")).toContainText("convite");
});
test("metadados editáveis não concedem administração", async ({ page }) => {
  await login(page, "spoof@example.test");
  await expect(page).toHaveURL(/\/$/);
  await page.goto("/equipe");
  await expect(page).toHaveURL(/\/$/);
});
test("administrador pode convidar sem escolher privilégios elevados", async ({ page }) => {
  await login(page, "admin@example.test");
  await expect(page).toHaveURL(/\/$/);
  await page.goto("/equipe");
  await page.getByLabel("E-mail do convidado").fill("new@example.test");
  await page.getByRole("button", { name: "Enviar convite" }).click();
  await expect(page.getByRole("status")).toContainText("Convite enviado");
});
test("convite inválido não abre sessão", async ({ page }) => {
  await page.goto("/convite#token_hash=invalid-test-token");
  await page.getByRole("button", { name: "Aceitar convite" }).click();
  await expect(page.locator("form").getByRole("alert")).toContainText("inválido ou expirado");
});
test("aceita convite e define senha sem colocar token no endereço enviado ao servidor", async ({ page }) => {
  await page.goto("/convite#token_hash=valid-test-invite");
  await page.getByRole("button", { name: "Aceitar convite" }).click();
  await expect(page).toHaveURL(/\/definir-senha$/);
  await page.getByLabel("Senha", { exact: true }).fill("my-new-test-password");
  await page.getByLabel("Confirmar senha").fill("different-test-password");
  await page.getByRole("button", { name: "Salvar senha" }).click();
  await expect(page.locator("form").getByRole("alert")).toContainText("iguais");
  await page.getByLabel("Senha", { exact: true }).fill("my-new-test-password");
  await page.getByLabel("Confirmar senha").fill("my-new-test-password");
  await page.getByRole("button", { name: "Salvar senha" }).click();
  await expect(page).toHaveURL(/\/$/);
});
test("sessão revogada perde acesso na próxima consulta", async ({ page, request }) => {
  await login(page, "revoked@example.test");
  await expect(page).toHaveURL(/\/$/);
  await request.post("http://127.0.0.1:54329/revoke", { data: { email: "revoked@example.test" } });
  expect((await page.request.get("/api/health")).status()).toBe(401);
  await page.goto("/");
  await expect(page).toHaveURL(/\/login$/);
});
test("servidor rejeita convite enviado por usuário comum mesmo com formulário copiado", async ({ page, browser, request }) => {
  await login(page, "admin@example.test");
  await expect(page).toHaveURL(/\/$/);
  await page.goto("/equipe");
  await page.getByLabel("E-mail do convidado").fill("replay@example.test");
  const sent = page.waitForRequest(req => req.method() === "POST" && req.url().endsWith("/equipe"));
  await page.getByRole("button", { name: "Enviar convite" }).click();
  const original = await sent;
  await expect(page.getByRole("status")).toContainText("Convite enviado");
  const before = await (await request.get("http://127.0.0.1:54329/stats")).json();
  const context = await browser.newContext({ baseURL: "http://127.0.0.1:3100" });
  try {
    const memberPage = await context.newPage();
    await login(memberPage, "attacker@example.test");
    await expect(memberPage).toHaveURL(/\/$/);
    const headers = original.headers();
    const result = await context.request.post("/equipe", {
      headers: { "content-type": headers["content-type"], "next-action": headers["next-action"], origin: "http://127.0.0.1:3100" },
      data: original.postDataBuffer() ?? undefined,
    });
    expect(await result.text()).toContain("Somente o administrador");
    const after = await (await request.get("http://127.0.0.1:54329/stats")).json();
    expect(after.inviteCount).toBe(before.inviteCount);
  } finally { await context.close(); }
});
test("login cabe no celular e permite navegação por teclado", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/login");
  await page.keyboard.press("Tab");
  await expect(page.getByLabel("E-mail", { exact: true })).toBeFocused();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: "node_modules/.cache/login-mobile.png", fullPage: true });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.screenshot({ path: "node_modules/.cache/login-desktop.png", fullPage: true });
});
test("sessão expirada sem renovação não autoriza a consulta", async ({ page }) => {
  await login(page, "expired@example.test");
  await expect(page.getByRole("button", { name: "Entrar", exact: true })).toBeEnabled();
  await expect(page).toHaveURL(/\/login$/);
  expect((await page.request.get("/api/health")).status()).toBe(401);
});