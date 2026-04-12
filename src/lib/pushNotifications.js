import { base44 } from '@/api/base44Client';

/**
 * Inizializza le push notification Capacitor e salva il token nel DB.
 * Chiama questa funzione solo dopo che l'utente è autenticato.
 */
export async function initPushNotifications() {
  // Funziona solo in ambiente Capacitor (app nativa)
  if (!window.Capacitor || !window.Capacitor.isNativePlatform()) return;

  const { PushNotifications } = window.Capacitor.Plugins;
  if (!PushNotifications) return;

  // Richiedi il permesso
  const permission = await PushNotifications.requestPermissions();
  if (permission.receive !== 'granted') {
    console.log('Permesso push notifications negato');
    return;
  }

  // Registra il dispositivo
  await PushNotifications.register();

  // Ascolta il token di registrazione
  PushNotifications.addListener('registration', async (tokenData) => {
    const token = tokenData.value;
    const platform = window.Capacitor.getPlatform(); // 'ios' o 'android'

    try {
      const user = await base44.auth.me();
      if (!user?.email) return;

      // Controlla se il token è già salvato
      const existing = await base44.entities.DeviceToken.filter({ user_email: user.email, token });
      if (existing.length === 0) {
        await base44.entities.DeviceToken.create({
          user_email: user.email,
          token,
          platform
        });
        console.log('Token push salvato:', platform, token.slice(0, 20) + '...');
      }
    } catch (err) {
      console.error('Errore salvataggio token push:', err);
    }
  });

  PushNotifications.addListener('registrationError', (err) => {
    console.error('Errore registrazione push:', err);
  });
}