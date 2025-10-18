import { useTranslation } from 'react-i18next';
import { useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
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
  Sparkles,
  Clock,
} from 'lucide-react';
import { useLocation } from 'wouter';
import dentistImage from '@assets/stock_images/professional_friendl_000b16d5.jpg';
import patientImage from '@assets/stock_images/happy_patient_dental_59f91926.jpg';
import techImage from '@assets/stock_images/modern_dental_techno_0b4f1a92.jpg';

export default function Landing() {
  const { t } = useTranslation();
  const [, setLocation] = useLocation();
  const [files, setFiles] = useState<File[]>([]);
  const [symptoms, setSymptoms] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const heroRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

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
      const response = await fetch('/api/cases/anonymous', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symptoms }),
      });

      if (!response.ok) throw new Error('Failed to create case');
      
      const caseData = await response.json();
      
      sessionStorage.setItem('anonymousCaseId', caseData.id);
      sessionStorage.setItem('uploadedFiles', JSON.stringify(files.map(f => ({ 
        name: f.name,
        size: f.size,
        type: f.type
      }))));
      
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title={t('hero.title')}
        description={t('hero.subtitle')}
      />
      <StructuredData type="service" />

      {/* Development Mode Banner */}
      {import.meta.env.DEV && (
        <div className="bg-yellow-500 text-yellow-950 px-4 py-2 text-center text-sm font-medium">
          🔧 Development Mode - Click "Login" to access the dev login page
        </div>
      )}

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
              onClick={() => window.location.href = import.meta.env.DEV ? '/dev-login' : '/api/login'}
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
        {/* Hero Section with Parallax */}
        <section ref={heroRef} className="relative overflow-hidden">
          {/* Gradient Background with Parallax */}
          <motion.div 
            className="absolute inset-0 bg-gradient-to-br from-[hsl(210,70%,92%)] via-[hsl(160,60%,90%)] to-[hsl(250,60%,92%)]"
            style={{ y: heroY, opacity: heroOpacity }}
          />
          
          {/* Decorative Floating Elements */}
          <motion.div
            className="absolute top-20 right-20 w-64 h-64 rounded-full bg-[hsl(270,50%,90%)] blur-3xl opacity-60"
            animate={{ 
              y: [0, -20, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{ 
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut" 
            }}
          />
          <motion.div
            className="absolute bottom-20 left-20 w-96 h-96 rounded-full bg-[hsl(25,70%,90%)] blur-3xl opacity-50"
            animate={{ 
              y: [0, 20, 0],
              scale: [1, 1.15, 1],
            }}
            transition={{ 
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut" 
            }}
          />

          <div className="container relative mx-auto px-4 py-24 md:py-32">
            <motion.div 
              className="mx-auto max-w-4xl text-center"
              initial="hidden"
              animate="visible"
              variants={containerVariants}
            >
              <motion.div variants={itemVariants}>
                <Badge className="mb-6 bg-white/80 text-primary border-0 shadow-lg backdrop-blur-sm" data-testid="badge-trust">
                  <Shield className="mr-1 h-3 w-3" />
                  {t('hero.trustBadge')}
                </Badge>
              </motion.div>
              
              <motion.h1 
                className="mb-6 text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl bg-gradient-to-br from-primary via-[hsl(210,85%,35%)] to-[hsl(250,70%,50%)] bg-clip-text text-transparent"
                variants={itemVariants}
              >
                {t('hero.title')}
              </motion.h1>
              
              <motion.p 
                className="mb-10 text-xl md:text-2xl text-foreground/80 font-medium"
                variants={itemVariants}
              >
                {t('hero.subtitle')}
              </motion.p>

              {/* File Upload Card */}
              <motion.div variants={itemVariants}>
                <Card className="mx-auto max-w-2xl border-0 shadow-2xl bg-white/90 dark:bg-gray-900/90 backdrop-blur-md">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-center gap-2 text-2xl">
                      <Upload className="h-6 w-6" />
                      {t('upload.title')}
                    </CardTitle>
                    <CardDescription className="text-base">{t('upload.description')}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <label className="mb-2 block text-sm font-medium">Describe your symptoms or concerns</label>
                      <Textarea
                        placeholder="e.g., Tooth pain, treatment offer review, second opinion needed..."
                        value={symptoms}
                        onChange={(e) => setSymptoms(e.target.value)}
                        className="min-h-28"
                        data-testid="textarea-symptoms"
                      />
                    </div>

                    <div className="rounded-xl border-2 border-dashed border-primary/40 bg-primary/5 p-12 text-center transition-all hover:border-primary/60 hover:bg-primary/10">
                      <motion.div
                        animate={{ y: [0, -8, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      >
                        <Upload className="mx-auto mb-4 h-16 w-16 text-primary" />
                      </motion.div>
                      <p className="mb-2 text-base font-semibold">{t('upload.dropzone')}</p>
                      <p className="mb-6 text-sm text-muted-foreground">{t('upload.fileTypes')}</p>
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
                        <Upload className="mr-2 h-5 w-5" />
                        Select Files
                      </Button>
                      {files.length > 0 && (
                        <motion.div 
                          className="mt-6 p-4 bg-primary/10 rounded-lg"
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                        >
                          <p className="text-sm font-medium text-primary">
                            ✓ {files.length} file(s) selected
                          </p>
                        </motion.div>
                      )}
                    </div>

                    <Button
                      onClick={handleContinue}
                      disabled={loading || files.length === 0 || !symptoms.trim()}
                      size="lg"
                      className="w-full text-lg py-6 hover-elevate active-elevate-2"
                      data-testid="button-continue-hero"
                    >
                      {loading ? (
                        <><Loader2 className="mr-2 h-5 w-5 animate-spin" />Creating case...</>
                      ) : (
                        <><ChevronRight className="mr-2 h-5 w-5" />Continue to Payment</>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Metrics Section with Pastel Background */}
        <section className="bg-gradient-to-r from-[hsl(200,60%,92%)] to-[hsl(160,60%,90%)] py-20">
          <div className="container mx-auto px-4">
            <motion.div 
              className="grid gap-12 sm:grid-cols-3"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={containerVariants}
            >
              <motion.div className="text-center" variants={itemVariants}>
                <motion.div 
                  className="mb-3 text-5xl md:text-6xl font-bold bg-gradient-to-br from-primary to-[hsl(210,85%,35%)] bg-clip-text text-transparent"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {t('metrics.analyses')}
                </motion.div>
                <p className="text-base font-medium text-foreground/70">{t('metrics.analysesLabel')}</p>
              </motion.div>
              <motion.div className="text-center" variants={itemVariants}>
                <motion.div 
                  className="mb-3 text-5xl md:text-6xl font-bold bg-gradient-to-br from-primary to-[hsl(210,85%,35%)] bg-clip-text text-transparent"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {t('metrics.patients')}
                </motion.div>
                <p className="text-base font-medium text-foreground/70">{t('metrics.patientsLabel')}</p>
              </motion.div>
              <motion.div className="text-center" variants={itemVariants}>
                <motion.div 
                  className="mb-3 text-5xl md:text-6xl font-bold bg-gradient-to-br from-primary to-[hsl(210,85%,35%)] bg-clip-text text-transparent"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {t('metrics.savings')}
                </motion.div>
                <p className="text-base font-medium text-foreground/70">{t('metrics.savingsLabel')}</p>
                <p className="mt-3 text-lg font-bold text-primary">{t('metrics.savingsCta')}</p>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Benefits Section with Images */}
        <section className="container mx-auto px-4 py-24">
          <motion.h2 
            className="mb-16 text-center text-4xl md:text-5xl font-bold"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {t('benefits.title')}
          </motion.h2>
          <motion.div 
            className="grid gap-8 md:grid-cols-2 lg:grid-cols-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={containerVariants}
          >
            <motion.div variants={itemVariants}>
              <Card className="h-full hover-elevate border-0 shadow-lg bg-[hsl(250,60%,92%)] dark:bg-[hsl(250,30%,15%)]">
                <CardHeader>
                  <motion.div 
                    className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white dark:bg-gray-800 shadow-lg"
                    whileHover={{ rotate: [0, -10, 10, 0] }}
                    transition={{ duration: 0.5 }}
                  >
                    <Shield className="h-8 w-8 text-primary" />
                  </motion.div>
                  <CardTitle className="text-xl">{t('benefits.neutral.title')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-foreground/70 leading-relaxed">{t('benefits.neutral.description')}</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="h-full hover-elevate border-0 shadow-lg bg-[hsl(25,70%,90%)] dark:bg-[hsl(25,30%,15%)]">
                <CardHeader>
                  <motion.div 
                    className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white dark:bg-gray-800 shadow-lg"
                    whileHover={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.5 }}
                  >
                    <Zap className="h-8 w-8 text-primary" />
                  </motion.div>
                  <CardTitle className="text-xl">{t('benefits.fast.title')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-foreground/70 leading-relaxed">{t('benefits.fast.description')}</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="h-full hover-elevate border-0 shadow-lg bg-[hsl(160,60%,90%)] dark:bg-[hsl(160,30%,15%)]">
                <CardHeader>
                  <motion.div 
                    className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white dark:bg-gray-800 shadow-lg"
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <DollarSign className="h-8 w-8 text-primary" />
                  </motion.div>
                  <CardTitle className="text-xl">{t('benefits.affordable.title')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-foreground/70 leading-relaxed">{t('benefits.affordable.description')}</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="h-full hover-elevate border-0 shadow-lg bg-[hsl(210,70%,92%)] dark:bg-[hsl(210,30%,15%)]">
                <CardHeader>
                  <motion.div 
                    className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white dark:bg-gray-800 shadow-lg"
                    whileHover={{ y: [-5, 5, -5] }}
                    transition={{ duration: 0.6, repeat: 3 }}
                  >
                    <UserCheck className="h-8 w-8 text-primary" />
                  </motion.div>
                  <CardTitle className="text-xl">{t('benefits.expert.title')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-foreground/70 leading-relaxed">{t('benefits.expert.description')}</p>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </section>

        {/* Trust Section with Images */}
        <section className="bg-gradient-to-br from-[hsl(270,50%,90%)] to-[hsl(200,60%,92%)] py-24">
          <div className="container mx-auto px-4">
            <motion.div 
              className="grid gap-12 md:grid-cols-2 lg:grid-cols-3 items-center"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={containerVariants}
            >
              <motion.div variants={itemVariants} className="lg:col-span-1">
                <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                  <img 
                    src={dentistImage} 
                    alt="Professional dentist" 
                    className="w-full h-80 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6 text-white">
                    <h3 className="text-xl font-bold mb-2">Expert Dentists</h3>
                    <p className="text-sm opacity-90">Licensed professionals you can trust</p>
                  </div>
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="lg:col-span-1">
                <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                  <img 
                    src={patientImage} 
                    alt="Happy patient" 
                    className="w-full h-80 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6 text-white">
                    <h3 className="text-xl font-bold mb-2">Patient Satisfaction</h3>
                    <p className="text-sm opacity-90">Thousands of successful reviews</p>
                  </div>
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="lg:col-span-1">
                <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                  <img 
                    src={techImage} 
                    alt="Modern technology" 
                    className="w-full h-80 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6 text-white">
                    <h3 className="text-xl font-bold mb-2">Advanced Technology</h3>
                    <p className="text-sm opacity-90">AI-powered analysis & insights</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="container mx-auto px-4 py-24">
          <motion.h2 
            className="mb-16 text-center text-4xl md:text-5xl font-bold"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {t('pricing.title')}
          </motion.h2>
          <motion.div 
            className="mx-auto grid max-w-5xl gap-8 md:grid-cols-2"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
          >
            <motion.div variants={itemVariants}>
              <Card className="h-full border-2 border-primary/30 hover-elevate shadow-xl bg-gradient-to-br from-[hsl(270,50%,90%)] to-white dark:from-[hsl(270,30%,15%)] dark:to-gray-900">
                <CardHeader>
                  <div className="mb-3 flex items-center gap-3">
                    <div className="p-3 bg-primary/10 rounded-xl">
                      <Brain className="h-7 w-7 text-primary" />
                    </div>
                    <CardTitle className="text-2xl">{t('pricing.ai.name')}</CardTitle>
                  </div>
                  <div className="text-4xl font-bold text-primary">{t('pricing.ai.price')}</div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {(Array.isArray(t('pricing.ai.features', { returnObjects: true })) 
                      ? t('pricing.ai.features', { returnObjects: true }) as string[]
                      : [
                        'Instant AI-powered analysis',
                        'Detailed findings report',
                        'Confidence scoring',
                        'PDF download'
                      ]
                    ).map((feature, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm">
                        <CheckCircle2 className="mt-0.5 h-5 w-5 text-primary flex-shrink-0" />
                        <span className="font-medium">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="h-full border-2 border-primary hover-elevate shadow-2xl bg-gradient-to-br from-[hsl(210,70%,92%)] to-white dark:from-[hsl(210,30%,15%)] dark:to-gray-900 relative overflow-hidden">
                <div className="absolute top-4 right-4">
                  <Badge className="bg-primary text-primary-foreground border-0 shadow-lg">
                    <Sparkles className="mr-1 h-3 w-3" />
                    Popular
                  </Badge>
                </div>
                <CardHeader>
                  <div className="mb-3 flex items-center gap-3">
                    <div className="p-3 bg-primary/10 rounded-xl">
                      <UserCheck className="h-7 w-7 text-primary" />
                    </div>
                    <CardTitle className="text-2xl">{t('pricing.expert.name')}</CardTitle>
                  </div>
                  <div className="text-4xl font-bold text-primary">{t('pricing.expert.price')}</div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {(Array.isArray(t('pricing.expert.features', { returnObjects: true })) 
                      ? t('pricing.expert.features', { returnObjects: true }) as string[]
                      : [
                        'Licensed dentist review',
                        'Detailed clinical notes',
                        'Treatment recommendations',
                        'Signed PDF report'
                      ]
                    ).map((feature, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm">
                        <CheckCircle2 className="mt-0.5 h-5 w-5 text-primary flex-shrink-0" />
                        <span className="font-medium">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-[hsl(25,70%,90%)] via-[hsl(210,70%,92%)] to-[hsl(160,60%,90%)] py-24">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Card className="border-0 shadow-2xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
                <CardContent className="flex flex-col items-center justify-center gap-8 py-16 text-center">
                  <motion.div
                    animate={{ 
                      rotate: [0, -10, 10, -10, 10, 0],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      repeatDelay: 3
                    }}
                  >
                    <TrendingDown className="h-20 w-20 text-primary" />
                  </motion.div>
                  <h3 className="text-3xl md:text-4xl font-bold">Start Saving Today!</h3>
                  <p className="max-w-2xl text-lg text-muted-foreground">
                    Join thousands of patients who have saved money on dental treatments with our independent second opinion service.
                  </p>
                  <Button
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    size="lg"
                    data-testid="button-cta-bottom"
                    className="text-lg px-8 py-6 hover-elevate active-elevate-2"
                  >
                    <Upload className="mr-2 h-6 w-6" />
                    {t('hero.cta')}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
