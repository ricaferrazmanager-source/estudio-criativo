import { expect, test, type Page } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/login");
  await page.getByLabel("E-mail", { exact: true }).fill("member@example.test");
  await page.getByLabel("Senha", { exact: true }).fill("example-test-password");
  await page.getByRole("button", { name: "Entrar", exact: true }).click();
  await page.getByRole("button", { name: "Produtos", exact: true }).click();
});
async function fillProduct(page: Page) {
  for (const [label, value] of Object.entries({ "Nome do produto": "Vaso Rose", "Código do produto (SKU)": "VS-ROSE", Categoria: "Decoração", Altura: "30,5", Largura: "20", Profundidade: "20", Materiais: "Cerâmica", Cores: "Branco" })) {
    await page.getByLabel(label, { exact: true }).fill(value);
  }
}
test("revisa e corrige os dados sem salvar ou enviar o produto", async ({ page }) => {
  const writes: string[] = [];
  page.on("request", request => { if (request.method() !== "GET") writes.push(request.url()); });
  await fillProduct(page);
  await page.getByLabel("O que deve permanecer igual").fill("Não adicionar alças");
  await page.getByRole("button", { name: "Revisar produto" }).click();
  await expect(page.getByRole("heading", { name: "Revise o produto" })).toBeFocused();
  await expect(page.getByText("30,5 cm", { exact: true })).toBeVisible();
  await expect(page.getByText("Não adicionar alças", { exact: true })).toBeVisible();
  await expect(page.getByText("Nenhum produto foi salvo.", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Voltar e corrigir" }).click();
  await expect(page.getByLabel("Nome do produto", { exact: true })).toHaveValue("Vaso Rose");
  await page.getByLabel("Nome do produto", { exact: true }).fill("Vaso revisado");
  await page.getByRole("button", { name: "Revisar produto" }).click();
  await expect(page.getByText("Vaso revisado", { exact: true })).toBeVisible();
  expect(writes).toEqual([]);
  await page.reload();
  await page.getByRole("button", { name: "Produtos", exact: true }).click();
  await expect(page.getByLabel("Nome do produto", { exact: true })).toBeEmpty();
});
test("explica campos vazios e medidas inválidas", async ({ page }) => {
  await page.getByRole("button", { name: "Revisar produto" }).click();
  await expect(page.getByLabel("Nome do produto", { exact: true })).toBeFocused();
  await expect(page.getByText("Informe o nome do produto.", { exact: true })).toBeVisible();
  await fillProduct(page);
  await page.getByLabel("Altura", { exact: true }).fill("-2");
  await page.getByRole("button", { name: "Revisar produto" }).click();
  await expect(page.getByText("Informe uma medida maior que zero.", { exact: true })).toBeVisible();
  await expect(page.getByLabel("Altura", { exact: true })).toBeFocused();
});
test("kit pede componentes e a tela cabe no celular", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await fillProduct(page);
  await page.getByLabel("Tipo de produto").selectOption("kit");
  await page.getByRole("button", { name: "Revisar produto" }).click();
  await expect(page.getByText("Descreva as peças e suas quantidades.", { exact: true })).toBeVisible();
  await page.getByLabel("Componentes do kit").fill("3 cestos: um grande, um médio e um pequeno");
  await page.screenshot({ path: "node_modules/.cache/product-mobile.png", fullPage: true });
  await page.getByRole("button", { name: "Revisar produto" }).click();
  await expect(page.getByText("3 cestos: um grande, um médio e um pequeno", { exact: true })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.screenshot({ path: "node_modules/.cache/product-review-desktop.png", fullPage: true });
});

test("salva e consulta o produto depois de recarregar", async ({ page }) => {
  await fillProduct(page);
  await page.getByLabel("Código do produto (SKU)", { exact: true }).fill(`SAVE-${Date.now()}`);
  await page.getByRole("button", { name: "Revisar produto" }).click();
  await page.getByRole("button", { name: "Salvar produto", exact: true }).click();
  await expect(page.getByText("Produto salvo com sucesso.", { exact: true })).toBeVisible();
  await page.reload();
  await page.getByRole("button", { name: "Produtos", exact: true }).click();
  await page.getByRole("button", { name: "Consultar produtos salvos" }).click();
  await expect(page.getByRole("heading", { name: "Produtos salvos" })).toBeVisible();
  await expect(page.locator("summary").filter({ hasText: "Vaso Rose" })).toBeVisible();
  await page.locator("summary").filter({ hasText: "Vaso Rose" }).click();
  await page.screenshot({ path: "node_modules/.cache/products-saved.png", fullPage: true });
});
test("falha de salvamento preserva os dados e não mostra sucesso", async ({ page }) => {
  await fillProduct(page);
  await page.route("**/api/products", route => route.fulfill({ status: 503, json: { error: "O salvamento ainda não está ativado." } }));
  await page.getByRole("button", { name: "Revisar produto" }).click();
  await page.getByRole("button", { name: "Salvar produto", exact: true }).click();
  await expect(page.getByText("O salvamento ainda não está ativado.", { exact: true })).toBeVisible();
  await expect(page.getByText("Produto salvo com sucesso.", { exact: true })).not.toBeVisible();
  await page.getByRole("button", { name: "Voltar e corrigir" }).click();
  await expect(page.getByLabel("Nome do produto", { exact: true })).toHaveValue("Vaso Rose");
});

test("API valida no servidor, impede origem externa e não duplica envios", async ({ page, request }) => {
  const headers = { Origin: "http://127.0.0.1:3100" };
  const draft = { name: "Produto API", sku: `API-${crypto.randomUUID()}`, category: "Teste", height: "1,5", width: "2", depth: "3", unit: "cm", kind: "Produto simples", materials: "Madeira", colors: "Natural", fixed: "", variable: "", components: "" };
  const id = crypto.randomUUID();
  expect((await request.get("/api/products")).status()).toBe(401);
  expect((await page.request.post("/api/products", { headers: { Origin: "https://other.example" }, data: { id, draft } })).status()).toBe(403);
  expect((await page.request.post("/api/products", { headers, data: { id, draft: { ...draft, height: "-1" } } })).status()).toBe(400);
  expect((await page.request.post("/api/products", { headers, data: { id, draft: { ...draft, name: "x".repeat(161) } } })).status()).toBe(400);
  for (let n=0; n<2; n++) {
    const response = await page.request.post("/api/products", { headers, data: { id, draft, organization_id: "untrusted-team" } });
    expect(response.status(), await response.text()).toBe(200); expect(await response.json()).toEqual({ id });
  }
  const result = await page.request.get("/api/products");
  const data = await result.json();
  expect(data.products.filter((item: { product_id: string }) => item.product_id === id)).toHaveLength(1);
  expect((await page.request.post("/api/products", { headers, data: { id: crypto.randomUUID(), draft } })).status()).toBe(409);
});
