import { exports } from "cloudflare:workers";
import { describe, expect, it } from "vitest";

// Requests execute inside the Workers runtime, without external services.
describe("Estúdio Criativo — base local", () => {
  it("confirma que a API está funcionando", async () => {
    const response = await exports.default.fetch("http://localhost/health");
    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toContain("application/json");
    expect(await response.json()).toEqual({ status: "ok", project: "Estúdio Criativo" });
  });

  it("retorna 404 para um endereço inexistente", async () => {
    const response = await exports.default.fetch("http://localhost/inexistente");
    expect(response.status).toBe(404);
    expect(await response.json()).toEqual({ error: "Not found" });
  });

  it("recusa alterações no endpoint de saúde", async () => {
    const response = await exports.default.fetch("http://localhost/health", { method: "POST" });
    expect(response.status).toBe(405);
    expect(response.headers.get("allow")).toBe("GET");
    expect(await response.json()).toEqual({ error: "Method not allowed" });
  });
});
