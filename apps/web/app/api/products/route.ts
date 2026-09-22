import { authClient, currentMember } from "../../../lib/supabase";
import { productDraft } from "../../../lib/product-draft";
const headers = { "Cache-Control": "private, no-store" };
const reply = (data: unknown, status = 200) => Response.json(data, { status, headers });
async function context() {
  const member = await currentMember();
  if (!member) return { error: reply({ error: "Entre novamente para acessar os produtos." }, 401) };
  if (process.env.STUDIO_CATALOG_ENABLED !== "true") return { error: reply({ error: "O salvamento ainda não está ativado." }, 503) };
  const client = await authClient();
  if (!client) return { error: reply({ error: "O catálogo está indisponível." }, 503) };
  const { data, error } = await client.from("memberships").select("organization_id").eq("user_id", member.id).eq("active", true).limit(2);
  if (error) return { error: reply({ error: "O catálogo ainda precisa ser ativado. Tente novamente mais tarde." }, 503) };
  if (data?.length !== 1) return { error: reply({ error: "Seu acesso precisa estar vinculado a uma única equipe. Procure o administrador." }, 403) };
  return { client, organization: data[0].organization_id as string };
}
export async function GET(request: Request) {
  try {
    const ctx = await context(); if (ctx.error) return ctx.error;
    const page = Number(new URL(request.url).searchParams.get("page") ?? 0);
    if (!Number.isInteger(page) || page < 0 || page > 10000) return reply({ error: "Página inválida." }, 400);
    const { data, error } = await ctx.client.from("product_versions").select("product_id,version,dna").eq("organization_id", ctx.organization).eq("version", 1).order("created_at", { ascending: false }).order("product_id").range(page * 20, page * 20 + 20);
    if (error) return reply({ error: "Não foi possível consultar os produtos. Tente novamente." }, 503);
    return reply({ products: (data ?? []).slice(0, 20), hasMore: (data?.length ?? 0) > 20 });
  } catch { return reply({ error: "Não foi possível consultar os produtos. Tente novamente." }, 503); }
}
export async function POST(request: Request) {
  if (!process.env.STUDIO_SITE_URL || request.headers.get("origin") !== new URL(process.env.STUDIO_SITE_URL).origin) return reply({ error: "Origem não permitida." }, 403);
  if (!request.headers.get("content-type")?.startsWith("application/json")) return reply({ error: "Formato inválido." }, 415);
  try {
    const ctx = await context(); if (ctx.error) return ctx.error;
    const reader = request.body?.getReader(); if (!reader) return reply({ error: "Dados inválidos." }, 400);
    let text = ""; let size = 0; const decoder = new TextDecoder();
    while (true) {
      const chunk = await reader.read(); if (chunk.done) break;
      size += chunk.value.byteLength;
      if (size > 32768) { await reader.cancel(); return reply({ error: "O cadastro excede o tamanho permitido." }, 413); }
      text += decoder.decode(chunk.value, { stream: true });
    }
    text += decoder.decode();
    let body: { id?: unknown; draft?: unknown };
    try { body = JSON.parse(text); } catch { return reply({ error: "Dados inválidos." }, 400); }
    if (!body || typeof body.id !== "string" || !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(body.id)) return reply({ error: "Identificação do envio inválida." }, 400);
    const dna = productDraft(body.draft);
    if (!dna) return reply({ error: "Confira os campos, medidas e componentes antes de salvar." }, 400);
    const { data, error } = await ctx.client.rpc("create_catalog_product", { p_id: body.id, p_organization_id: ctx.organization, p_dna: dna });
    if (error?.code === "23505") return reply({ error: "Já existe um produto com esse código ou este envio foi alterado. Consulte os produtos salvos antes de tentar novamente." }, 409);
    if (error?.code === "42501") return reply({ error: "Seu acesso à equipe foi alterado. Procure o administrador." }, 403);
    if (error?.code === "22023") return reply({ error: "Confira os dados antes de salvar." }, 400);
    if (error || data !== body.id) return reply({ error: "Não foi possível confirmar o salvamento. Tente novamente sem alterar os dados ou consulte os produtos salvos." }, 503);
    return reply({ id: data });
  } catch { return reply({ error: "Não foi possível confirmar o salvamento. Tente novamente sem alterar os dados ou consulte os produtos salvos." }, 503); }
}
