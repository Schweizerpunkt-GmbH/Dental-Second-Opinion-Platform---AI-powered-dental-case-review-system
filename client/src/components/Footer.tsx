import { Link } from 'wouter';
import { useTranslation } from 'react-i18next';
import { Shield, FileText, Mail } from 'lucide-react';

export function Footer() {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-muted/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* About */}
          <div>
            <h3 className="mb-4 text-sm font-semibold">DentalSecondOpinion</h3>
            <p className="text-sm text-muted-foreground">
              Professional dental second opinions powered by AI and expert dentists.
            </p>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="mb-4 text-sm font-semibold">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-foreground">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-foreground">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/imprint" className="text-muted-foreground hover:text-foreground">
                  Imprint
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="mb-4 text-sm font-semibold">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#faq" className="text-muted-foreground hover:text-foreground">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#contact" className="text-muted-foreground hover:text-foreground">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-4 text-sm font-semibold">Contact</h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail className="h-4 w-4" />
              <a href="mailto:info@dentalsecondopinion.ch" className="hover:text-foreground">
                info@dentalsecondopinion.ch
              </a>
            </div>
          </div>
        </div>

        {/* Medical Disclaimers */}
        <div className="mt-12 space-y-4 border-t pt-8">
          <div className="flex items-start gap-3 rounded-lg bg-amber-50 p-4 dark:bg-amber-950/20">
            <Shield className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-600 dark:text-amber-500" />
            <div className="text-sm text-amber-900 dark:text-amber-200">
              <p className="font-semibold mb-1">Medical Disclaimer / Medizinischer Haftungsausschluss</p>
              <p className="text-xs leading-relaxed">
                <strong>EN:</strong> This service provides informational second opinions and does not replace professional medical advice, diagnosis, or treatment. Always seek the advice of your dentist or qualified health provider with any questions you may have regarding a dental condition. This is not a certified medical device.
              </p>
              <p className="text-xs leading-relaxed mt-2">
                <strong>DE:</strong> Dieser Service bietet informative Zweitmeinungen und ersetzt keine professionelle medizinische Beratung, Diagnose oder Behandlung. Wenden Sie sich bei Fragen zu einem zahnärztlichen Zustand immer an Ihren Zahnarzt oder qualifizierten Gesundheitsdienstleister. Dies ist kein zertifiziertes Medizinprodukt.
              </p>
              <p className="text-xs leading-relaxed mt-2">
                <strong>FR:</strong> Ce service fournit des deuxièmes avis informatifs et ne remplace pas les conseils, diagnostics ou traitements médicaux professionnels. Consultez toujours votre dentiste ou un professionnel de santé qualifié pour toute question concernant une condition dentaire. Ceci n'est pas un dispositif médical certifié.
              </p>
              <p className="text-xs leading-relaxed mt-2">
                <strong>IT:</strong> Questo servizio fornisce secondi pareri informativi e non sostituisce la consulenza, diagnosi o trattamento medico professionale. Consultare sempre il proprio dentista o un operatore sanitario qualificato per qualsiasi domanda riguardante una condizione dentale. Questo non è un dispositivo medico certificato.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-lg bg-blue-50 p-4 dark:bg-blue-950/20">
            <FileText className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600 dark:text-blue-500" />
            <div className="text-sm text-blue-900 dark:text-blue-200">
              <p className="font-semibold mb-1">Data Protection / Datenschutz</p>
              <p className="text-xs leading-relaxed">
                Your data is processed in accordance with GDPR/DSGVO and Swiss data protection regulations. All medical images and personal information are encrypted and stored securely. We never share your data with third parties without your explicit consent.
              </p>
              <p className="text-xs leading-relaxed mt-1">
                Ihre Daten werden gemäss DSGVO und Schweizer Datenschutzvorschriften verarbeitet. Alle medizinischen Bilder und persönlichen Informationen werden verschlüsselt und sicher gespeichert.
              </p>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>© {currentYear} DentalSecondOpinion. All rights reserved.</p>
          <p className="mt-2 text-xs">
            Service operated in compliance with Swiss medical regulations and EU GDPR.
          </p>
        </div>
      </div>
    </footer>
  );
}
