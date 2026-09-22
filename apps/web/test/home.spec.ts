import { expect, test } from "@playwright/test";
test.beforeEach(async ({ page }) => {
  await page.goto("/login");
  await page.getByLabel("E-mail", { exact: true }).fill("member@example.test");
  await page.getByLabel("Senha", { exact: true }).fill("example-test-password");
  await page.getByRole("button", { name: "Entrar", exact: true }).click();
  await expect(page).toHaveURL(/\/$/);
});

test("apresenta a tela e permite navegar pelas explicações", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Seu estúdio começa aqui." })).toBeVisible();
  await page.getByRole("button", { name: "Como funciona", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Do produto à imagem", exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Próximas etapas", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Um passo de cada vez.", exact: true })).toBeVisible();
});

test("mostra sucesso apenas após a base responder", async ({ page }) => {
  await page.route("**/api/health", route => route.fulfill({ json: { status: "ok", project: "Estúdio Criativo" } }));
  await page.goto("/");
  await expect(page.getByText("Pronta para verificar", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Verificar agora" }).click();
  await expect(page.getByText("Base funcionando", { exact: true })).toBeVisible();
});

test("explica a indisponibilidade e permite tentar novamente", async ({ page }) => {
  await page.route("**/api/health", route => route.fulfill({ status: 503, json: { error: "unavailable" } }));
  await page.goto("/");
  await page.getByRole("button", { name: "Verificar agora" }).click();
  await expect(page.getByText("Base indisponível", { exact: true })).toBeVisible();
  await page.route("**/api/health", route => route.fulfill({ json: { status: "ok", project: "Estúdio Criativo" } }));
  await page.getByRole("button", { name: "Tentar novamente" }).click();
  await expect(page.getByText("Base funcionando", { exact: true })).toBeVisible();
});

test("cabe na tela de celular", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Seu estúdio começa aqui." })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});
