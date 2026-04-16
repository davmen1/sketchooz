import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    // Verifica autenticazione: deve essere un utente loggato
    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { userEmail, renderTitle } = await req.json();

    if (!userEmail || !renderTitle) {
      return Response.json({ success: false, message: 'Missing userEmail or renderTitle' }, { status: 400 });
    }

    // Un utente normale può notificare solo se stesso; un admin può notificare chiunque
    if (user.role !== 'admin' && user.email !== userEmail) {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    const deviceTokens = await base44.asServiceRole.entities.DeviceToken.filter({ user_email: userEmail });

    if (!deviceTokens || deviceTokens.length === 0) {
      console.log(`Nessun token per: ${userEmail}`);
      return Response.json({ success: true, message: 'Nessun dispositivo da notificare.' });
    }

    const fcmServerKey = Deno.env.get('FCM_SERVER_KEY');
    if (!fcmServerKey) {
      console.error('FCM_SERVER_KEY non configurata');
      return Response.json({ success: false, message: 'FCM_SERVER_KEY mancante.' }, { status: 500 });
    }

    const results = [];
    for (const device of deviceTokens) {
      const fcmRes = await fetch('https://fcm.googleapis.com/fcm/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `key=${fcmServerKey}`
        },
        body: JSON.stringify({
          to: device.token,
          notification: {
            title: '🎨 Render completato!',
            body: `Il tuo render "${renderTitle}" è pronto. Tocca per vederlo!`
          },
          data: { screen: 'gallery' }
        })
      });
      const fcmJson = await fcmRes.json();
      console.log(`FCM [${device.platform}] ${device.token.slice(0, 20)}...:`, JSON.stringify(fcmJson));
      results.push({ platform: device.platform, result: fcmJson });
    }

    return Response.json({ success: true, results });
  } catch (error) {
    console.error('Errore sendRenderNotification:', error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
});