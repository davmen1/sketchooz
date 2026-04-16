import { createClientFromRequest } from "npm:@base44/sdk@0.8.25";

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json(
        { error: "Unauthorized: No valid session found" },
        { status: 401 }
      );
    }

    return Response.json({ user });

  } catch (error) {
    console.error("Auth error:", error.message);
    return Response.json(
      { error: "Authentication failed" },
      { status: 401 }
    );
  }
});