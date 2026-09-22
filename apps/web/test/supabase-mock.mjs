// Local test double for the external Supabase Auth API. Never loaded by the app.
import { createServer } from "node:http";
import { catalogRequest } from "./catalog-mock.mjs";
const sessions = new Map();
const passwords = new Map();
let inviteCount = 0; let tokenCount = 0;
const date = "2026-09-09T12:00:00Z";
function user(email) { return { id: "00000000-0000-4000-8000-000000000001", aud: "authenticated", role: "authenticated", email, created_at: date, email_confirmed_at: date, invited_at: email.startsWith("uninvited") ? null : date, app_metadata: { provider: "email", studio_role: email.startsWith("admin") ? "admin" : "member" }, user_metadata: { studio_role: "admin" } }; }
function session(email) {
  const payload = Buffer.from(JSON.stringify({ sub: "00000000-0000-4000-8000-000000000001", exp: Math.floor(Date.now()/1000)+(email.startsWith("expired") ? -60 : 3600) })).toString("base64url");
  const token = `eyJhbGciOiJIUzI1NiJ9.${payload}.${Buffer.from(`${email}-${++tokenCount}`).toString("base64url")}`;
  sessions.set(token, email);
  return { access_token: token, token_type: "bearer", refresh_token: "test-refresh", expires_in: email.startsWith("expired") ? -60 : 3600, user: user(email) };
}
createServer(async (req, res) => {
  let body = ""; for await (const chunk of req) body += chunk;
  const data = body ? JSON.parse(body) : {};
  const path = new URL(req.url, "http://127.0.0.1").pathname;
  const email = sessions.get(req.headers.authorization?.replace("Bearer ", ""));
  function send(code, data) { res.writeHead(code, { "Content-Type": "application/json" }); res.end(JSON.stringify(data)); }
  if (path.startsWith("/rest/v1/")) return catalogRequest(path, new URL(req.url, "http://127.0.0.1"), data, email, send);
  if (path === "/test-email-link") return send(200, session(data.email));
  if (path === "/ready") return send(200, {});
  if (path === "/stats") return send(200, { inviteCount });
  if (path === "/revoke") { for (const [key, value] of sessions) if (value === data.email) sessions.delete(key); return send(200, {}); }
  if (path === "/auth/v1/token") {
    if (!data.email || data.email.startsWith("wrong") || (passwords.has(data.email) && passwords.get(data.email) !== data.password)) return send(400, { code: "invalid_credentials", msg: "Invalid credentials" });
    return send(200, session(data.email));
  }
  if (path === "/auth/v1/user" && email && !email.startsWith("expired")) { if (req.method === "PUT" && data.password) passwords.set(email, data.password); return send(200, user(email)); }
  if (path === "/auth/v1/logout") { sessions.delete(req.headers.authorization?.replace("Bearer ", "")); return send(200, {}); }
  if (path === "/auth/v1/verify") return data.token_hash === "valid-test-invite" ? send(200, session("invited@example.test")) : send(403, { code: "otp_expired", msg: "Expired" });
  if (path === "/auth/v1/invite" && req.headers.apikey === "test-secret-not-a-real-key") { inviteCount++; return send(200, user(data.email)); }
  return send(401, { code: "bad_jwt", msg: "Invalid session" });
}).listen(54329, "127.0.0.1");