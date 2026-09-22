import { expect, test } from "@playwright/test";

test("link padrão de recuperação permite definir senha e entrar com ela", async ({ page, request }) => {
  const email = "recovery@example.test";
  const session = await (await request.post("http://127.0.0.1:54329/test-email-link", { data: { email } })).json();
  const urls: string[] = []; page.on("request", req => urls.push(req.url()));
  await page.goto(`/#type=recovery&access_token=${session.access_token}&refresh_token=${session.refresh_token}`);
  await expect(page.getByRole("button", { name: "Continuar para definir senha" })).toBeVisible();
  await expect(page).toHaveURL(/\/login$/);
  expect((await page.request.get("/api/health")).status()).toBe(401);
  await page.getByRole("button", { name: "Continuar para definir senha" }).click();
  await expect(page).toHaveURL(/\/definir-senha$/);
  await page.getByLabel("Senha", { exact: true }).fill("my-recovered-test-password");
  await page.getByLabel("Confirmar senha").fill("my-recovered-test-password");
  await page.getByRole("button", { name: "Salvar senha" }).click();
  await expect(page).toHaveURL(/\/$/);
  expect(urls.every(url => !url.includes(session.access_token) && !url.includes(session.refresh_token))).toBe(true);
  expect(await page.evaluate(() => Object.keys(localStorage).length)).toBe(0);
  const cookies = await page.context().cookies();
  expect(cookies.filter(cookie => cookie.name.includes("auth-token")).every(cookie => cookie.httpOnly)).toBe(true);
  await page.getByRole("button", { name: "Sair", exact: true }).click();
  await page.getByLabel("E-mail", { exact: true }).fill(email);
  await page.getByLabel("Senha", { exact: true }).fill("my-recovered-test-password");
  await page.getByRole("button", { name: "Entrar", exact: true }).click();
  await expect(page).toHaveURL(/\/$/);
});
test("convite padrão também encaminha para definir senha", async ({ page, request }) => {
  const session = await (await request.post("http://127.0.0.1:54329/test-email-link", { data: { email: "standard-invite@example.test" } })).json();
  await page.goto(`/convite#type=invite&access_token=${session.access_token}&refresh_token=${session.refresh_token}`);
  await page.getByRole("button", { name: "Continuar para definir senha" }).click();
  await expect(page).toHaveURL(/\/definir-senha$/);
});
test("recuperação não permite usuário sem convite nem sessão expirada", async ({ page, request }) => {
  for (const email of ["uninvited-recovery@example.test", "expired-recovery@example.test"]) {
    await page.goto("about:blank");
    const session = await (await request.post("http://127.0.0.1:54329/test-email-link", { data: { email } })).json();
    await page.goto(`/login#type=recovery&access_token=${session.access_token}&refresh_token=${session.refresh_token}`);
    await page.getByRole("button", { name: "Continuar para definir senha" }).click();
    await expect(page.locator(".form-error")).toContainText("inválido ou expirado");
    expect((await page.request.get("/api/health")).status()).toBe(401);
  }
});
test("erro do provedor é explicado e removido do endereço", async ({ page }) => {
  await page.goto("/login#error=access_denied&error_code=otp_expired&error_description=provider-detail");
  await expect(page.locator(".form-error")).toContainText("inválido ou expirado");
  await expect(page).toHaveURL(/\/login$/);
  await expect(page.getByText("provider-detail")).not.toBeVisible();
});
