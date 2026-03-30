import React from 'react';
import MobileHeader from '@/components/MobileHeader';
import { useLang } from '@/lib/LangContext';

export default function TermsOfService() {
  const { lang } = useLang();
  const it = lang === 'it';

  return (
    <div className="flex flex-col flex-1 bg-background text-foreground">
      <MobileHeader title={it ? 'Termini e Condizioni' : 'Terms of Service'} />
      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8 space-y-6 text-sm text-foreground">
        <p className="text-xs text-muted-foreground">{it ? 'Ultimo aggiornamento: marzo 2025' : 'Last updated: March 2025'}</p>

        <section className="space-y-2">
          <h2 className="font-bold text-base">{it ? '1. Descrizione del servizio' : '1. Service Description'}</h2>
          <p>{it
            ? 'Sketchooz è un servizio di generazione di sketch di design industriale tramite intelligenza artificiale. Caricando una foto di un prodotto, l\'utente ottiene una resa stilistica professionale in diversi formati grafici.'
            : 'Sketchooz is an AI-powered industrial design sketch generation service. By uploading a product photo, the user receives a professional stylistic rendering in various graphic formats.'}</p>
        </section>

        <section className="space-y-2">
          <h2 className="font-bold text-base">{it ? '2. Crediti e pagamenti' : '2. Credits & Payments'}</h2>
          <ul className="list-disc ml-5 space-y-1">
            <li>{it ? 'Il servizio funziona tramite un sistema di crediti prepagati.' : 'The service operates on a prepaid credits system.'}</li>
            <li>{it ? 'Ogni generazione consuma 3 crediti. Le correzioni e le vectorizzazioni consumano crediti aggiuntivi.' : 'Each generation consumes 3 credits. Corrections and vectorizations consume additional credits.'}</li>
            <li>{it ? 'I crediti non hanno scadenza.' : 'Credits do not expire.'}</li>
            <li>{it ? 'I pagamenti sono elaborati in modo sicuro tramite Stripe.' : 'Payments are securely processed via Stripe.'}</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="font-bold text-base">{it ? '3. Politica di rimborso' : '3. Refund Policy'}</h2>
          <p>{it
            ? 'I crediti acquistati non sono rimborsabili, salvo malfunzionamento tecnico documentato del servizio. In caso di problemi, contattare treddistudio@gmail.com entro 14 giorni dall\'acquisto.'
            : 'Purchased credits are non-refundable, except in case of documented technical malfunction of the service. In case of issues, contact treddistudio@gmail.com within 14 days of purchase.'}</p>
        </section>

        <section className="space-y-2">
          <h2 className="font-bold text-base">{it ? '4. Proprietà intellettuale' : '4. Intellectual Property'}</h2>
          <p>{it
            ? 'Le immagini generate sono di proprietà dell\'utente che le ha richieste. Treddi Studio non rivendica alcun diritto sulle immagini prodotte tramite Sketchooz. L\'utente è responsabile del rispetto dei diritti di terzi nelle immagini caricate.'
            : "Generated images belong to the user who requested them. Treddi Studio claims no rights over images produced via Sketchooz. The user is responsible for respecting third-party rights in uploaded images."}</p>
        </section>

        <section className="space-y-2">
          <h2 className="font-bold text-base">{it ? '5. Licenza commerciale' : '5. Commercial License'}</h2>
          <ul className="list-disc ml-5 space-y-1">
            <li>{it ? '❌ I piani Trial, Starter e Pro NON includono la licenza commerciale.' : '❌ Trial, Starter and Pro plans do NOT include a commercial license.'}</li>
            <li>{it ? 'È vietato utilizzare gli output generati per clienti, agenzie, attività monetizzate, rivendita o qualsiasi scopo che generi reddito diretto o indiretto.' : 'It is forbidden to use generated outputs for clients, agencies, monetized activities, resale, or any purpose that generates direct or indirect income.'}</li>
            <li>{it ? '✅ Solo il piano Enterprise include la licenza commerciale completa, con diritto di sfruttamento economico degli output generati.' : '✅ Only the Enterprise plan includes a full commercial license, with the right to commercially exploit generated outputs.'}</li>
            <li>{it ? "L'uso commerciale senza licenza Enterprise costituisce una violazione contrattuale e può comportare la sospensione immediata dell'account." : 'Commercial use without an Enterprise license constitutes a contractual breach and may result in immediate account suspension.'}</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="font-bold text-base">{it ? '6. Limitazione di responsabilità' : '5. Limitation of Liability'}</h2>
          <p>{it
            ? 'Sketchooz è fornito "così com\'è". Treddi Studio non garantisce risultati specifici e non è responsabile per usi impropri delle immagini generate. Il servizio può essere interrotto per manutenzione senza preavviso.'
            : 'Sketchooz is provided "as is". Treddi Studio does not guarantee specific results and is not responsible for improper use of generated images. The service may be interrupted for maintenance without notice.'}</p>
        </section>

        <section className="space-y-2">
          <h2 className="font-bold text-base">{it ? '7. Legge applicabile' : '6. Governing Law'}</h2>
          <p>{it
            ? 'Questi termini sono regolati dalla legge italiana. Per qualsiasi controversia è competente il Foro di Milano.'
            : 'These terms are governed by Italian law. The Court of Milan has jurisdiction over any disputes.'}</p>
        </section>

        <section className="space-y-2">
          <h2 className="font-bold text-base">{it ? '8. Contatti' : '7. Contact'}</h2>
          <p>Treddi Studio — treddistudio@gmail.com</p>
          <p>www.sketchooz.com</p>
        </section>
      </main>
    </div>
  );
}