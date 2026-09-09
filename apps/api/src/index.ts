export default {
  fetch(request: Request): Response {
    const { pathname } = new URL(request.url);

    if (pathname !== "/health") {
      return Response.json({ error: "Not found" }, { status: 404 });
    }

    if (request.method !== "GET") {
      return Response.json(
        { error: "Method not allowed" },
        { status: 405, headers: { Allow: "GET" } },
      );
    }

    return Response.json({ status: "ok", project: "Estúdio Criativo" });
  },
} satisfies ExportedHandler;
