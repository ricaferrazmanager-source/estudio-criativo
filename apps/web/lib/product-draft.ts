// Contrato inicial de cadastro; não representa todo o Product DNA planejado.
export function productDraft(input: unknown): Record<string, string> | null {
  if (!input || typeof input !== "object" || Array.isArray(input)) return null;
  const source = input as Record<string, unknown>;
  const result: Record<string, string> = { schema_version: "entry-1" };
  for (const field of ["name", "sku", "category", "height", "width", "depth", "unit", "kind", "materials", "colors", "fixed", "variable", "components"]) {
    if (typeof source[field] !== "string") return null;
    const value = source[field].trim();
    const measure = ["height", "width", "depth"].includes(field);
    const optional = ["fixed", "variable", "components"].includes(field);
    if (value.length > (optional ? 2000 : measure ? 20 : 160) || (!optional && !value)) return null;
    if (measure && (!/^\d+(?:[.,]\d+)?$/.test(value) || Number(value.replace(",", ".")) <= 0 || !Number.isFinite(Number(value.replace(",", "."))))) return null;
    result[field] = measure ? value.replace(",", ".") : value;
  }
  if (!["cm", "mm", "m"].includes(result.unit) || !["Produto simples", "Kit / conjunto"].includes(result.kind)) return null;
  if (result.kind === "Kit / conjunto" && !result.components) return null;
  if (result.kind === "Produto simples") result.components = "";
  return result;
}
