import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { SEO } from '@/components/SEO';
import { StructuredData } from '@/components/StructuredData';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { ThemeToggle } from '@/components/theme-toggle';
import { Footer } from '@/components/Footer';
import { useToast } from '@/hooks/use-toast';
import {
  Upload,
  Shield,
  Zap,
  DollarSign,
  UserCheck,
  CheckCircle2,
  TrendingDown,
  FileText,
  Brain,
  ChevronRight,
  Loader2,
} from 'lucide-react';
import { useLocation } from 'wouter';
import { apiRequest } from '@/lib/queryClient';

export default function Landing() {
  const { t } = useTranslation();
  const [, setLocation] = useLocation();
  const [files, setFiles] = useState<File[]>([]);
  const [symptoms, setSymptoms] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleContinue = async () => {
    if (files.length === 0) {
      toast({
        title: "No files selected",
        description: "Please select at least one file to upload",
        variant: "destructive",
      });
      return;
    }

    if (!symptoms.trim()) {
      toast({
        title: "Missing information",
        description: "Please describe your symptoms or concerns",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Create anonymous case
      const response = await fetch('/api/cases/anonymous', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symptoms }),
      });

      if (!response.ok) throw new Error('Failed to create case');
      
      const caseData = await response.json();
      
      // Store case ID and file info in session
      sessionStorage.setItem('anonymousCaseId', caseData.id);
      sessionStorage.setItem('uploadedFiles', JSON.stringify(files.map(f => ({ 
        name: f.name,
        size: f.size,
        type: f.type
      }))));
      
      // Redirect to payment selection
      setLocation(`/case/${caseData.id}`);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <SEO 
        title={t('hero.title')}
        description={t('hero.subtitle')}
      />
      <StructuredData type="service" />
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <FileText className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">DentalSecondOpinion</span>
          </div>
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <ThemeToggle />
            <Button
              onClick={() => window.location.href = '/api/login'}
              variant="default"
              data-testid="button-login"
              className="hover-elevate active-elevate-2"
            >
              {t('nav.login')}
            </Button>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-20">
          <motion.div 
            className="mx-auto max-w-4xl text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.4 }}
            >
              <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20" data-testid="badge-trust">
                <Shield className="mr-1 h-3 w-3" />
                {t('hero.trustBadge')}
              </Badge>
            </motion.div>
            <motion.h1 
              className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              {t('hero.title')}
            </motion.h1>
            <motion.p 
              className="mb-8 text-xl text-muted-foreground"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              {t('hero.subtitle')}
            </motion.p>

            {/* File Upload */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
            <Card className="mx-auto mb-12 max-w-2xl border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center justify-center gap-2">
                  <Upload className="h-5 w-5" />
                  {t('upload.title')}
                </CardTitle>
                <CardDescription>{t('upload.description')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium">Describe your symptoms or concerns</label>
                  <Textarea
                    placeholder="e.g., Tooth pain, treatment offer review, second opinion needed..."
                    value={symptoms}
                    onChange={(e) => setSymptoms(e.target.value)}
                    className="min-h-24"
                    data-testid="textarea-symptoms"
                  />
                </div>

                <div className="rounded-lg border-2 border-dashed border-primary/30 p-12 text-center transition-colors hover:border-primary/50">
                  <Upload className="mx-auto mb-4 h-12 w-12 text-primary" />
                  <p className="mb-2 text-sm font-medium">{t('upload.dropzone')}</p>
                  <p className="mb-4 text-xs text-muted-foreground">{t('upload.fileTypes')}</p>
                  <input
                    type="file"
                    multiple
                    accept=".jpg,.jpeg,.png,.dcm,.pdf"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="hero-file-upload"
                  />
                  <Button
                    onClick={() => document.getElementById('hero-file-upload')?.click()}
                    size="lg"
                    variant="outline"
                    data-testid="button-upload-hero"
                    className="hover-elevate active-elevate-2"
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Select Files
                  </Button>
                  {files.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm text-muted-foreground">
                        {files.length} file(s) selected
                      </p>
                    </div>
                  )}
                </div>

                <Button
                  onClick={handleContinue}
                  disabled={loading || files.length === 0 || !symptoms.trim()}
                  size="lg"
                  className="w-full hover-elevate active-elevate-2"
                  data-testid="button-continue-hero"
                >
                  {loading ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Creating case...</>
                  ) : (
                    <><ChevronRight className="mr-2 h-4 w-4" />Continue to Payment</>
                  )}
                </Button>
              </CardContent>
            </Card>
            </motion.div>
          </motion.div>
        </section>

        {/* Metrics Section */}
        <section className="border-y bg-muted/50 py-16">
          <div className="container mx-auto px-4">
            <div className="grid gap-8 sm:grid-cols-3">
              <div className="text-center">
                <div className="mb-2 text-4xl font-bold text-primary">{t('metrics.analyses')}</div>
                <p className="text-sm text-muted-foreground">{t('metrics.analysesLabel')}</p>
              </div>
              <div className="text-center">
                <div className="mb-2 text-4xl font-bold text-primary">{t('metrics.patients')}</div>
                <p className="text-sm text-muted-foreground">{t('metrics.patientsLabel')}</p>
              </div>
              <div className="text-center">
                <div className="mb-2 text-4xl font-bold text-primary">{t('metrics.savings')}</div>
                <p className="text-sm text-muted-foreground">{t('metrics.savingsLabel')}</p>
                <p className="mt-2 font-semibold text-primary">{t('metrics.savingsCta')}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="container mx-auto px-4 py-20">
          <motion.h2 
            className="mb-12 text-center text-3xl font-bold"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            {t('benefits.title')}
          </motion.h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.5 }}
            >
            <Card className="hover-elevate">
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>{t('benefits.neutral.title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{t('benefits.neutral.description')}</p>
              </CardContent>
            </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
            <Card className="hover-elevate">
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>{t('benefits.fast.title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{t('benefits.fast.description')}</p>
              </CardContent>
            </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
            <Card className="hover-elevate">
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <DollarSign className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>{t('benefits.affordable.title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{t('benefits.affordable.description')}</p>
              </CardContent>
            </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
            <Card className="hover-elevate">
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <UserCheck className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>{t('benefits.expert.title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{t('benefits.expert.description')}</p>
              </CardContent>
            </Card>
            </motion.div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="border-t bg-muted/50 py-20">
          <div className="container mx-auto px-4">
            <h2 className="mb-12 text-center text-3xl font-bold">{t('pricing.title')}</h2>
            <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-2">
              <Card className="border-primary/50 hover-elevate">
                <CardHeader>
                  <div className="mb-2 flex items-center gap-2">
                    <Brain className="h-5 w-5 text-primary" />
                    <CardTitle>{t('pricing.ai.name')}</CardTitle>
                  </div>
                  <div className="text-3xl font-bold text-primary">{t('pricing.ai.price')}</div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {(Array.isArray(t('pricing.ai.features', { returnObjects: true })) 
                      ? t('pricing.ai.features', { returnObjects: true }) as string[]
                      : [
                        'Instant AI-powered analysis',
                        'Detailed findings report',
                        'Confidence scoring',
                        'PDF download'
                      ]
                    ).map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 text-primary" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-primary hover-elevate">
                <CardHeader>
                  <div className="mb-2 flex items-center gap-2">
                    <UserCheck className="h-5 w-5 text-primary" />
                    <CardTitle>{t('pricing.expert.name')}</CardTitle>
                    <Badge className="bg-primary">Popular</Badge>
                  </div>
                  <div className="text-3xl font-bold text-primary">{t('pricing.expert.price')}</div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {(Array.isArray(t('pricing.expert.features', { returnObjects: true })) 
                      ? t('pricing.expert.features', { returnObjects: true }) as string[]
                      : [
                        'Licensed dentist review',
                        'Detailed clinical notes',
                        'Treatment recommendations',
                        'Signed PDF report'
                      ]
                    ).map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 text-primary" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 py-20">
          <Card className="border-primary/50 bg-primary/5">
            <CardContent className="flex flex-col items-center justify-center gap-6 py-12 text-center">
              <TrendingDown className="h-16 w-16 text-primary" />
              <h3 className="text-2xl font-bold">Start Saving Today!</h3>
              <p className="max-w-2xl text-muted-foreground">
                Join thousands of patients who have saved money on dental treatments with our independent second opinion service.
              </p>
              <Button
                onClick={() => document.getElementById('hero-file-upload')?.click()}
                size="lg"
                data-testid="button-cta-bottom"
                className="hover-elevate active-elevate-2"
              >
                <Upload className="mr-2 h-5 w-5" />
                {t('hero.cta')}
              </Button>
            </CardContent>
          </Card>
        </section>
      </main>

      <Footer />
    </div>
  );
}
