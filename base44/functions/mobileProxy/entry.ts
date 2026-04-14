import { createClientFromRequest } from "npm:@base44/sdk@0.8.25";

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    // Chiamiamo sia l'utente che i dati iniziali (batch)
    const [user, batch] = await Promise.all([
      base44.auth.me(),
      base44.auth.batch() 
    ]);
    return Response.json({ user, batch });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});