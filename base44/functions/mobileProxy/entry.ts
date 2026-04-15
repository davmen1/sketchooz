import { createClientFromRequest } from "npm:@base44/sdk@0.8.25";

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    // Usiamo solo .me() che siamo sicuri esista
    const user = await base44.auth.me();
    return Response.json({ user });
  } catch (error) {
    // Questo ci aiuterà a capire se il problema è il login
    return Response.json({ 
      error: error.message,
      stack: error.stack 
    }, { status: 500 });
  }
});