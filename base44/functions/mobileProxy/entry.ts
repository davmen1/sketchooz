import { createClientFromRequest } from "npm:@base44/sdk@0.8.25";

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    
    // Tentiamo di recuperare l'utente
    const user = await base44.auth.me();

    // CHECK ESPLICITO: Se l'SDK non lancia errore ma user è null/undefined
    if (!user) {
      return Response.json(
        { error: "Unauthorized: No valid session found" }, 
        { status: 401 }
      );
    }

    // Se arriviamo qui, l'utente è autenticato correttamente
    return Response.json({ user });

  } catch (error) {
    // Se .me() fallisce, significa che il token è invalido o scaduto
    // Restituiamo 401 invece di 500 per proteggere l'endpoint
    console.error("Auth error:", error.message);
    
    return Response.json(
      { error: "Authentication failed" }, 
      { status: 401 }
    );
  }
});