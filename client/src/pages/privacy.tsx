import { Footer } from '@/components/Footer';
import { SEO } from '@/components/SEO';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Shield } from 'lucide-react';

export default function Privacy() {
  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Privacy Policy" 
        description="Learn how DentalSecondOpinion protects your medical data and privacy. GDPR compliant with full data transparency."
      />
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto flex h-16 items-center gap-4 px-4">
          <Link href="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <h1 className="text-lg font-semibold">Privacy Policy</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto max-w-4xl px-4 py-12">
        <div className="prose prose-gray dark:prose-invert max-w-none">
          <p className="lead">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <h2>1. Data Controller</h2>
          <p>
            DentalSecondOpinion<br />
            Switzerland<br />
            Email: info@dentalsecondopinion.ch
          </p>

          <h2>2. Data Collection & Processing</h2>
          <h3>2.1 Medical Data</h3>
          <p>
            We process the following medical data:
          </p>
          <ul>
            <li>Dental X-rays, OPT, CBCT scans, and treatment offers</li>
            <li>Symptom descriptions and dental concerns</li>
            <li>AI analysis results and dentist reviews</li>
          </ul>
          <p>
            Legal basis: Your explicit consent (Art. 6(1)(a) GDPR) and contract fulfillment (Art. 6(1)(b) GDPR).
          </p>

          <h3>2.2 Personal Data</h3>
          <ul>
            <li>Name and email address (for authentication)</li>
            <li>Payment information (processed by Stripe)</li>
            <li>IP address and browser information (for security)</li>
          </ul>

          <h3>2.3 Cookies & Tracking</h3>
          <p>
            We use essential cookies for authentication and optional analytics cookies with your consent.
          </p>

          <h2>3. Data Storage & Security</h2>
          <ul>
            <li>All medical images are encrypted at rest and in transit (TLS/SSL)</li>
            <li>Data is stored on secure servers in compliance with GDPR</li>
            <li>Access is restricted to authorized personnel only</li>
            <li>Regular security audits and penetration testing</li>
          </ul>

          <h2>4. Data Sharing</h2>
          <p>
            We do NOT sell your data. We only share data with:
          </p>
          <ul>
            <li><strong>Licensed Dentists:</strong> Only for professional review when you purchase expert opinions</li>
            <li><strong>Payment Processor:</strong> Stripe (for payment processing only)</li>
            <li><strong>Cloud Infrastructure:</strong> Secure hosting providers (encrypted storage)</li>
          </ul>

          <h2>5. Your Rights (GDPR)</h2>
          <ul>
            <li><strong>Right to Access:</strong> Request a copy of your data</li>
            <li><strong>Right to Rectification:</strong> Correct inaccurate data</li>
            <li><strong>Right to Erasure:</strong> Delete your account and all data</li>
            <li><strong>Right to Data Portability:</strong> Export your data in JSON format</li>
            <li><strong>Right to Object:</strong> Object to data processing</li>
            <li><strong>Right to Withdraw Consent:</strong> At any time</li>
          </ul>
          <p>
            Contact info@dentalsecondopinion.ch to exercise your rights.
          </p>

          <h2>6. Data Retention</h2>
          <ul>
            <li>Medical data: Retained for 10 years (Swiss medical record requirements)</li>
            <li>Account data: Until account deletion</li>
            <li>Payment records: 10 years (tax compliance)</li>
          </ul>

          <h2>7. International Transfers</h2>
          <p>
            Data may be transferred to countries outside the EU/EEA with adequate protection mechanisms (Standard Contractual Clauses).
          </p>

          <h2>8. Automated Decision-Making</h2>
          <p>
            Our AI analysis is informational only and does NOT make final medical decisions. 
            All significant decisions require human review by licensed dentists.
          </p>

          <h2>9. Children's Privacy</h2>
          <p>
            Our service is not intended for users under 16. We do not knowingly collect data from children.
          </p>

          <h2>10. Changes to Privacy Policy</h2>
          <p>
            We may update this policy. Significant changes will be communicated via email.
          </p>

          <h2>11. Contact & Complaints</h2>
          <p>
            Data Protection Officer: info@dentalsecondopinion.ch<br />
            You have the right to lodge a complaint with your national data protection authority.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
