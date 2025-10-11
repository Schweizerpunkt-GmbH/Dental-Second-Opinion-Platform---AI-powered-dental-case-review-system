import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { X, Cookie } from 'lucide-react';

export function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      setShow(true);
    }
  }, []);

  const acceptAll = () => {
    localStorage.setItem('cookie-consent', 'all');
    setShow(false);
  };

  const acceptEssential = () => {
    localStorage.setItem('cookie-consent', 'essential');
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" />
      
      {/* Cookie Banner */}
      <Card className="relative z-50 w-full max-w-2xl shadow-2xl">
        <CardContent className="p-6">
          <button
            onClick={acceptEssential}
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>

          <div className="flex items-start gap-4">
            <Cookie className="h-8 w-8 text-primary" />
            <div className="flex-1">
              <h3 className="text-lg font-semibold mb-2">🍪 Cookie Settings</h3>
              
              <p className="text-sm text-muted-foreground mb-4">
                We use cookies to enhance your experience, analyze site traffic, and for marketing purposes. 
                You can accept all cookies or choose essential cookies only.
              </p>

              <div className="mb-4 space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <div className="mt-0.5 h-4 w-4 rounded border border-primary bg-primary" />
                  <div>
                    <p className="font-medium">Essential Cookies (Required)</p>
                    <p className="text-xs text-muted-foreground">
                      Necessary for the website to function. Includes authentication and security.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <div className="mt-0.5 h-4 w-4 rounded border border-muted-foreground" />
                  <div>
                    <p className="font-medium">Analytics & Performance</p>
                    <p className="text-xs text-muted-foreground">
                      Help us understand how visitors use our website to improve user experience.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  onClick={acceptAll} 
                  className="flex-1 hover-elevate active-elevate-2"
                  data-testid="button-accept-all-cookies"
                >
                  Accept All
                </Button>
                <Button 
                  onClick={acceptEssential} 
                  variant="outline" 
                  className="flex-1 hover-elevate active-elevate-2"
                  data-testid="button-essential-cookies"
                >
                  Essential Only
                </Button>
              </div>

              <p className="mt-4 text-xs text-muted-foreground">
                By clicking "Accept All", you agree to our use of cookies. 
                Read our{' '}
                <a href="/privacy" className="text-primary underline-offset-4 hover:underline">
                  Privacy Policy
                </a>
                ,{' '}
                <a href="/disclaimer" className="text-primary underline-offset-4 hover:underline">
                  Medical Disclaimer
                </a>
                {' '}and{' '}
                <a href="/imprint" className="text-primary underline-offset-4 hover:underline">
                  Imprint
                </a>
                .
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
