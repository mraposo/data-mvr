export interface Env {
  DB: D1Database;
}

export default {
  async fetch(req: Request, env: Env): Promise<Response> {
    const url = new URL(req.url);

    // Simpele router op basis van pathname
    if (req.method === "GET" && url.pathname === "/users") {
      const result = await env.DB.prepare("SELECT * FROM users").all();
      return Response.json(result.results);
    }

    if (req.method === "POST" && url.pathname === "/users") {
      const body = await req.json<{ name: string; email: string }>();
      await env.DB
        .prepare("INSERT INTO users (name, email) VALUES (?, ?)")
        .bind(body.name, body.email)
        .run();
      return Response.json({ success: true }, { status: 201 });
    }

    return new Response("Not found", { status: 404 });
  },
};