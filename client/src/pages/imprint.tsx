import { Footer } from '@/components/Footer';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FileText } from 'lucide-react';

export default function Imprint() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto flex h-16 items-center gap-4 px-4">
          <Link href="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            <h1 className="text-lg font-semibold">Imprint / Impressum</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto max-w-4xl px-4 py-12">
        <div className="prose prose-gray dark:prose-invert max-w-none">
          <h2>Company Information / Firmeninformationen</h2>
          <p>
            <strong>Company Name:</strong> DentalSecondOpinion<br />
            <strong>Country:</strong> Switzerland<br />
            <strong>Email:</strong> info@dentalsecondopinion.ch
          </p>

          <h2>Legal Notice / Rechtliche Hinweise</h2>
          
          <h3>Service Description</h3>
          <p>
            DentalSecondOpinion provides informational dental second opinions using AI technology and licensed dental professionals. 
            This service is intended for educational and informational purposes only.
          </p>

          <h3>Medical Disclaimer</h3>
          <div className="rounded-lg bg-amber-50 p-4 dark:bg-amber-950/20">
            <p className="m-0">
              <strong>⚠️ Important:</strong> This service does NOT replace professional medical advice, diagnosis, or treatment. 
              Always consult with a licensed dentist or qualified healthcare provider for medical decisions. 
              This is NOT a certified medical device (MDR/IVDR).
            </p>
          </div>

          <h3>Liability / Haftung</h3>
          <p>
            We strive for accuracy but make no warranties about the completeness, reliability, or accuracy of information provided. 
            We are not liable for any losses or damages arising from the use of our service.
          </p>

          <h3>Intellectual Property</h3>
          <p>
            All content, trademarks, and logos are property of DentalSecondOpinion. 
            Unauthorized use is prohibited.
          </p>

          <h3>Dispute Resolution</h3>
          <p>
            <strong>Governing Law:</strong> Swiss Law<br />
            <strong>Jurisdiction:</strong> Courts of Switzerland<br />
            <strong>EU Online Dispute Resolution:</strong> <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener">https://ec.europa.eu/consumers/odr</a>
          </p>

          <h3>Professional Associations</h3>
          <p>
            Our dentist partners are licensed professionals registered with their respective national dental associations.
          </p>

          <h2>Contact</h2>
          <p>
            For general inquiries: info@dentalsecondopinion.ch<br />
            For data protection: info@dentalsecondopinion.ch<br />
            For technical support: support@dentalsecondopinion.ch
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
