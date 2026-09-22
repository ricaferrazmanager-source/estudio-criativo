import { currentMember } from "../../../lib/supabase";
export async function GET() {
  if (!await currentMember()) return Response.json({ error: "unauthorized" }, { status: 401 });
  try {
    const response = await fetch("http://127.0.0.1:8787/health", {
      cache: "no-store", signal: AbortSignal.timeout(3000),
    });
    const data = await response.json();
    if (response.ok && data.status === "ok" && data.project === "Estúdio Criativo") {
      return Response.json({ status: "ok", project: "Estúdio Criativo" });
    }
  } catch { /* A base local pode estar desligada. */ }
  return Response.json({ error: "unavailable" }, { status: 503 });
}