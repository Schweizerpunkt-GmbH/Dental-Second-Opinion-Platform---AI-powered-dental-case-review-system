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
                <Link href="/disclaimer" className="text-muted-foreground hover:text-foreground">
                  Medical Disclaimer
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
