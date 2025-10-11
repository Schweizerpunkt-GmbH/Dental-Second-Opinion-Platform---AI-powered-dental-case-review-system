import { Footer } from '@/components/Footer';
import { SEO } from '@/components/SEO';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { ArrowLeft, AlertTriangle, Shield } from 'lucide-react';

export default function Disclaimer() {
  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Medical Disclaimer" 
        description="Medical disclaimer and legal information for DentalSecondOpinion service."
      />
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto flex h-16 items-center gap-4 px-4">
          <Link href="/">
            <Button variant="ghost" size="icon" data-testid="button-back-home">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-6 w-6 text-amber-600" />
            <h1 className="text-xl font-semibold">Medical Disclaimer</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-4xl space-y-8">
          
          {/* English */}
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <Shield className="h-6 w-6 text-amber-600" />
              <h2 className="text-2xl font-bold">Medical Disclaimer (English)</h2>
            </div>
            <div className="rounded-lg border bg-amber-50 p-6 dark:bg-amber-950/20">
              <h3 className="text-lg font-semibold mb-3">Not a Replacement for Professional Medical Advice</h3>
              <p className="text-sm leading-relaxed mb-4">
                This service provides <strong>informational second opinions only</strong> and does not replace professional medical advice, diagnosis, or treatment. The AI-powered analysis and dentist reviews are provided for educational and informational purposes.
              </p>
              
              <h3 className="text-lg font-semibold mb-3">Always Consult Your Healthcare Provider</h3>
              <p className="text-sm leading-relaxed mb-4">
                Always seek the advice of your dentist or other qualified health provider with any questions you may have regarding a dental condition or treatment plan. Never disregard professional medical advice or delay in seeking it because of information received through this service.
              </p>

              <h3 className="text-lg font-semibold mb-3">Not a Certified Medical Device</h3>
              <p className="text-sm leading-relaxed mb-4">
                This platform is <strong>not a certified medical device</strong> (CE-certified or FDA-approved). It does not provide diagnoses, prescriptions, or treatment plans. All information should be verified with your treating physician.
              </p>

              <h3 className="text-lg font-semibold mb-3">No Doctor-Patient Relationship</h3>
              <p className="text-sm leading-relaxed mb-4">
                Use of this service does not create a doctor-patient relationship. The dentists reviewing your cases provide professional opinions but are not your treating physicians and do not assume responsibility for your care.
              </p>

              <h3 className="text-lg font-semibold mb-3">Emergency Situations</h3>
              <p className="text-sm leading-relaxed">
                If you think you may have a dental emergency, call your dentist or emergency services immediately. Do not use this service for urgent medical situations.
              </p>
            </div>
          </section>

          {/* German */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold">Medizinischer Haftungsausschluss (Deutsch)</h2>
            <div className="rounded-lg border bg-amber-50 p-6 dark:bg-amber-950/20">
              <h3 className="text-lg font-semibold mb-3">Kein Ersatz für professionelle medizinische Beratung</h3>
              <p className="text-sm leading-relaxed mb-4">
                Dieser Service bietet <strong>nur informative Zweitmeinungen</strong> und ersetzt keine professionelle medizinische Beratung, Diagnose oder Behandlung. Die KI-gestützte Analyse und Zahnarztbewertungen dienen ausschliesslich zu Bildungs- und Informationszwecken.
              </p>
              
              <h3 className="text-lg font-semibold mb-3">Konsultieren Sie immer Ihren Gesundheitsdienstleister</h3>
              <p className="text-sm leading-relaxed mb-4">
                Wenden Sie sich bei Fragen zu einem zahnärztlichen Zustand oder Behandlungsplan immer an Ihren Zahnarzt oder einen anderen qualifizierten Gesundheitsdienstleister. Ignorieren Sie niemals professionelle medizinische Beratung oder verzögern Sie die Suche danach aufgrund von Informationen, die Sie über diesen Service erhalten haben.
              </p>

              <h3 className="text-lg font-semibold mb-3">Kein zertifiziertes Medizinprodukt</h3>
              <p className="text-sm leading-relaxed mb-4">
                Diese Plattform ist <strong>kein zertifiziertes Medizinprodukt</strong> (CE-zertifiziert oder FDA-zugelassen). Sie stellt keine Diagnosen, Verschreibungen oder Behandlungspläne bereit. Alle Informationen sollten mit Ihrem behandelnden Arzt verifiziert werden.
              </p>

              <h3 className="text-lg font-semibold mb-3">Kein Arzt-Patienten-Verhältnis</h3>
              <p className="text-sm leading-relaxed mb-4">
                Die Nutzung dieses Dienstes begründet kein Arzt-Patienten-Verhältnis. Die Zahnärzte, die Ihre Fälle prüfen, geben professionelle Meinungen ab, sind aber nicht Ihre behandelnden Ärzte und übernehmen keine Verantwortung für Ihre Versorgung.
              </p>

              <h3 className="text-lg font-semibold mb-3">Notfallsituationen</h3>
              <p className="text-sm leading-relaxed">
                Wenn Sie glauben, einen zahnärztlichen Notfall zu haben, rufen Sie sofort Ihren Zahnarzt oder den Notdienst an. Verwenden Sie diesen Service nicht für dringende medizinische Situationen.
              </p>
            </div>
          </section>

          {/* French */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold">Avis Médical de Non-responsabilité (Français)</h2>
            <div className="rounded-lg border bg-amber-50 p-6 dark:bg-amber-950/20">
              <h3 className="text-lg font-semibold mb-3">Ne remplace pas les conseils médicaux professionnels</h3>
              <p className="text-sm leading-relaxed mb-4">
                Ce service fournit <strong>uniquement des deuxièmes avis informatifs</strong> et ne remplace pas les conseils, diagnostics ou traitements médicaux professionnels. L'analyse par IA et les avis de dentistes sont fournis à des fins éducatives et informatives.
              </p>
              
              <h3 className="text-lg font-semibold mb-3">Consultez toujours votre professionnel de santé</h3>
              <p className="text-sm leading-relaxed mb-4">
                Consultez toujours votre dentiste ou un autre professionnel de santé qualifié pour toute question concernant une condition dentaire ou un plan de traitement. Ne négligez jamais les conseils médicaux professionnels et ne tardez pas à les rechercher en raison d'informations reçues via ce service.
              </p>

              <h3 className="text-lg font-semibold mb-3">Pas un dispositif médical certifié</h3>
              <p className="text-sm leading-relaxed mb-4">
                Cette plateforme <strong>n'est pas un dispositif médical certifié</strong> (marquage CE ou approbation FDA). Elle ne fournit pas de diagnostics, de prescriptions ou de plans de traitement. Toutes les informations doivent être vérifiées avec votre médecin traitant.
              </p>

              <h3 className="text-lg font-semibold mb-3">Aucune relation médecin-patient</h3>
              <p className="text-sm leading-relaxed mb-4">
                L'utilisation de ce service ne crée pas de relation médecin-patient. Les dentistes qui examinent vos cas fournissent des avis professionnels mais ne sont pas vos médecins traitants et n'assument pas la responsabilité de vos soins.
              </p>

              <h3 className="text-lg font-semibold mb-3">Situations d'urgence</h3>
              <p className="text-sm leading-relaxed">
                Si vous pensez avoir une urgence dentaire, appelez immédiatement votre dentiste ou les services d'urgence. N'utilisez pas ce service pour des situations médicales urgentes.
              </p>
            </div>
          </section>

          {/* Italian */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold">Disclaimer Medico (Italiano)</h2>
            <div className="rounded-lg border bg-amber-50 p-6 dark:bg-amber-950/20">
              <h3 className="text-lg font-semibold mb-3">Non sostituisce la consulenza medica professionale</h3>
              <p className="text-sm leading-relaxed mb-4">
                Questo servizio fornisce <strong>solo secondi pareri informativi</strong> e non sostituisce la consulenza, diagnosi o trattamento medico professionale. L'analisi AI e le revisioni dei dentisti sono fornite a scopo educativo e informativo.
              </p>
              
              <h3 className="text-lg font-semibold mb-3">Consultare sempre il proprio operatore sanitario</h3>
              <p className="text-sm leading-relaxed mb-4">
                Consultare sempre il proprio dentista o altro operatore sanitario qualificato per qualsiasi domanda riguardante una condizione dentale o un piano di trattamento. Non ignorare mai i consigli medici professionali o ritardare la ricerca a causa delle informazioni ricevute tramite questo servizio.
              </p>

              <h3 className="text-lg font-semibold mb-3">Non è un dispositivo medico certificato</h3>
              <p className="text-sm leading-relaxed mb-4">
                Questa piattaforma <strong>non è un dispositivo medico certificato</strong> (marcatura CE o approvazione FDA). Non fornisce diagnosi, prescrizioni o piani di trattamento. Tutte le informazioni devono essere verificate con il medico curante.
              </p>

              <h3 className="text-lg font-semibold mb-3">Nessuna relazione medico-paziente</h3>
              <p className="text-sm leading-relaxed mb-4">
                L'uso di questo servizio non crea una relazione medico-paziente. I dentisti che esaminano i vostri casi forniscono pareri professionali ma non sono i vostri medici curanti e non si assumono la responsabilità delle vostre cure.
              </p>

              <h3 className="text-lg font-semibold mb-3">Situazioni di emergenza</h3>
              <p className="text-sm leading-relaxed">
                Se pensate di avere un'emergenza dentale, chiamate immediatamente il vostro dentista o i servizi di emergenza. Non utilizzate questo servizio per situazioni mediche urgenti.
              </p>
            </div>
          </section>

          <div className="rounded-lg border-2 border-amber-600 bg-amber-50 p-6 dark:bg-amber-950/20">
            <p className="text-center text-sm font-medium text-amber-900 dark:text-amber-200">
              By using this service, you acknowledge that you have read and understood this medical disclaimer.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
