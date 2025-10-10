import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Shield, Brain, UserCheck, ArrowRight, Sparkles } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Sparkles className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-semibold">DentalSecondOpinion</span>
          </div>
          <Button 
            onClick={() => window.location.href = '/api/login'}
            data-testid="button-login"
            className="hover-elevate active-elevate-2"
          >
            Sign In
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden border-b">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-background" />
        <div className="container relative mx-auto px-4 py-24 md:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Get a{" "}
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Second Opinion
              </span>
              {" "}on Your Dental Care
            </h1>
            <p className="mb-8 text-lg text-muted-foreground md:text-xl">
              AI-powered analysis combined with expert dentist review. Get accurate, 
              trustworthy insights on your dental X-rays and treatment plans within hours.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button
                size="lg"
                onClick={() => window.location.href = '/api/login'}
                data-testid="button-get-started"
                className="hover-elevate active-elevate-2"
              >
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
                data-testid="button-learn-more"
                className="hover-elevate active-elevate-2"
              >
                Learn More
              </Button>
            </div>

            {/* Trust badges */}
            <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-primary" />
                <span>GDPR Compliant</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <span>256-bit Encryption</span>
              </div>
              <div className="flex items-center gap-2">
                <UserCheck className="h-4 w-4 text-primary" />
                <span>Licensed Dentists</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="border-b py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">How It Works</h2>
            <p className="text-lg text-muted-foreground">
              Get professional insights in three simple steps
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <Card className="hover-elevate">
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <span className="text-2xl font-bold text-primary">1</span>
                </div>
                <CardTitle>Upload Your Images</CardTitle>
                <CardDescription>
                  Securely upload your dental X-rays, OPT, DVT, CBCT scans, or treatment offers
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover-elevate">
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-medical-ai/10">
                  <Brain className="h-6 w-6 text-medical-ai" />
                </div>
                <CardTitle>AI Analysis</CardTitle>
                <CardDescription>
                  Our AI analyzes your images and generates a detailed report with findings and confidence scores
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover-elevate">
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-medical-dentist/10">
                  <UserCheck className="h-6 w-6 text-medical-dentist" />
                </div>
                <CardTitle>Expert Review</CardTitle>
                <CardDescription>
                  Optionally request a licensed dentist to review your case and provide professional insights
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-b py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">Why Choose Us</h2>
            <p className="text-lg text-muted-foreground">
              Professional, secure, and affordable second opinions
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Brain,
                title: "AI-Powered Analysis",
                description: "Advanced machine learning models trained on thousands of dental cases",
              },
              {
                icon: UserCheck,
                title: "Licensed Professionals",
                description: "All reviews conducted by verified, experienced dental professionals",
              },
              {
                icon: Shield,
                title: "GDPR Compliant",
                description: "Your data is encrypted and stored securely with full privacy compliance",
              },
              {
                icon: CheckCircle2,
                title: "Fast Results",
                description: "AI reports within minutes, dentist reviews within 24-48 hours",
              },
              {
                icon: ArrowRight,
                title: "Find a Dentist",
                description: "Get matched with partner practices in your area for treatment",
              },
              {
                icon: Sparkles,
                title: "Transparent Pricing",
                description: "Clear, upfront pricing for AI analysis and professional reviews",
              },
            ].map((feature, i) => (
              <Card key={i} className="hover-elevate">
                <CardHeader>
                  <feature.icon className="mb-2 h-8 w-8 text-primary" />
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5">
            <CardContent className="p-12 text-center">
              <h2 className="mb-4 text-3xl font-bold md:text-4xl">
                Ready to Get Your Second Opinion?
              </h2>
              <p className="mb-8 text-lg text-muted-foreground">
                Join thousands of patients who trust us for their dental care decisions
              </p>
              <Button
                size="lg"
                onClick={() => window.location.href = '/api/login'}
                data-testid="button-cta-start"
                className="hover-elevate active-elevate-2"
              >
                Start Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm text-muted-foreground">
              © 2024 DentalSecondOpinion. All rights reserved.
            </p>
            <p className="text-xs text-muted-foreground">
              Medical Disclaimer: This service is for informational purposes only and does not replace professional dental examination.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
