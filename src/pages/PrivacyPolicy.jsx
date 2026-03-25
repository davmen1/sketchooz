import React from 'react';
import MobileHeader from '@/components/MobileHeader';
import { useLang } from '@/lib/LangContext';

export default function PrivacyPolicy() {
  const { lang } = useLang();
  const it = lang === 'it';

  return (
    <div className="flex flex-col flex-1">
      <MobileHeader title={it ? 'Privacy Policy' : 'Privacy Policy'} />
      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8 space-y-6 text-sm text-foreground">
        <p className="text-xs text-muted-foreground">{it ? 'Ultimo aggiornamento: marzo 2025' : 'Last updated: March 2025'}</p>

        <section className="space-y-2">
          <h2 className="font-bold text-base">{it ? '1. Titolare del trattamento' : '1. Data Controller'}</h2>
          <p>{it
            ? 'Il titolare del trattamento è Treddi Studio, contattabile all\'indirizzo email: treddistudio@gmail.com'
            : 'The data controller is Treddi Studio, reachable at: treddistudio@gmail.com'}</p>
        </section>

        <section className="space-y-2">
          <h2 className="font-bold text-base">{it ? '2. Dati raccolti' : '2. Data Collected'}</h2>
          <ul className="list-disc ml-5 space-y-1">
            <li>{it ? 'Email e nome utente (forniti in fase di registrazione)' : 'Email and username (provided at registration)'}</li>
            <li>{it ? 'Immagini caricate per la generazione di sketch (non conservate permanentemente)' : 'Images uploaded for sketch generation (not stored permanently)'}</li>
            <li>{it ? 'Dati di utilizzo: numero di render effettuati, data e ora' : 'Usage data: number of renders performed, date and time'}</li>
            <li>{it ? 'Dati di pagamento gestiti da Stripe (non accessibili a Treddi Studio)' : 'Payment data handled by Stripe (not accessible to Treddi Studio)'}</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="font-bold text-base">{it ? '3. Finalità del trattamento' : '3. Purpose of Processing'}</h2>
          <ul className="list-disc ml-5 space-y-1">
            <li>{it ? 'Erogazione del servizio di rendering AI' : 'Provision of the AI rendering service'}</li>
            <li>{it ? 'Gestione degli acquisti e dei crediti' : 'Management of purchases and credits'}</li>
            <li>{it ? 'Supporto utenti e gestione delle contestazioni' : 'User support and dispute handling'}</li>
            <li>{it ? 'Adempimento di obblighi legali e fiscali' : 'Compliance with legal and tax obligations'}</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="font-bold text-base">{it ? '4. Conservazione dei dati' : '4. Data Retention'}</h2>
          <p>{it
            ? 'I dati vengono conservati per il tempo strettamente necessario all\'erogazione del servizio e, ove previsto dalla legge, per gli obblighi fiscali (10 anni per i dati contabili).'
            : 'Data is retained for as long as necessary to provide the service and, where required by law, for tax obligations (10 years for accounting data).'}</p>
        </section>

        <section className="space-y-2">
          <h2 className="font-bold text-base">{it ? '5. Condivisione con terze parti' : '5. Third-Party Sharing'}</h2>
          <ul className="list-disc ml-5 space-y-1">
            <li><strong>Stripe</strong> — {it ? 'processore pagamenti (USA, Privacy Shield)' : 'payment processor (US, Privacy Shield)'}</li>
            <li><strong>OpenAI / Google</strong> — {it ? 'generazione delle immagini AI' : 'AI image generation'}</li>
            <li><strong>Base44</strong> — {it ? 'infrastruttura cloud e database' : 'cloud infrastructure and database'}</li>
          </ul>
          <p>{it ? 'Nessun dato viene venduto a terzi.' : 'No data is sold to third parties.'}</p>
        </section>

        <section className="space-y-2">
          <h2 className="font-bold text-base">{it ? '6. I tuoi diritti (GDPR)' : '6. Your Rights (GDPR)'}</h2>
          <p>{it
            ? 'In qualità di interessato hai diritto a: accesso (art. 15), rettifica (art. 16), cancellazione (art. 17), limitazione (art. 18), portabilità (art. 20), opposizione (art. 21).'
            : 'As a data subject you have the right to: access (art. 15), rectification (art. 16), erasure (art. 17), restriction (art. 18), portability (art. 20), objection (art. 21).'}</p>
          <p>{it
            ? 'Per esercitare i tuoi diritti, invia una email a treddistudio@gmail.com con oggetto "Richiesta GDPR — [tipo richiesta]". Risponderemo entro 30 giorni.'
            : 'To exercise your rights, send an email to treddistudio@gmail.com with subject "GDPR Request — [type]". We will respond within 30 days.'}</p>
        </section>

        <section className="space-y-2">
          <h2 className="font-bold text-base">{it ? '7. Cookie e tracciamento' : '7. Cookies & Tracking'}</h2>
          <p>{it
            ? 'L\'app non utilizza cookie di profilazione o tracciamento di terze parti. Vengono usati solo dati in localStorage per le preferenze dell\'utente (lingua, codice promo).'
            : 'The app does not use profiling or third-party tracking cookies. Only localStorage data is used for user preferences (language, promo code).'}</p>
        </section>

        <section className="space-y-2">
          <h2 className="font-bold text-base">{it ? '8. Contatti' : '8. Contact'}</h2>
          <p>treddistudio@gmail.com</p>
          <p>www.sketch-forge.com</p>
        </section>
      </main>
    </div>
  );
}