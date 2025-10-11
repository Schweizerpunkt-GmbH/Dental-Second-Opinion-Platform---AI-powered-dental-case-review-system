import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'wouter';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
}

export function SEO({ title, description, image, url }: SEOProps) {
  const { i18n } = useTranslation();
  const [location] = useLocation();
  
  const baseUrl = "https://dentalsecondopinion.ch";
  const defaultTitle = "DentalSecondOpinion - Professional Dental Second Opinions";
  const defaultDescription = "Get professional dental second opinions for only 9.90 CHF. AI-powered analysis and expert dentist reviews. Save money on dental treatments with independent, neutral advice.";
  const defaultImage = `${baseUrl}/og-image.jpg`;
  
  const pageTitle = title ? `${title} | DentalSecondOpinion` : defaultTitle;
  const pageDescription = description || defaultDescription;
  const pageImage = image || defaultImage;
  const canonicalUrl = url || `${baseUrl}${location}`;
  
  // Generate alternate language URLs
  const languages = ['de', 'en', 'fr', 'it'];
  const alternateUrls = languages.map(lang => ({
    lang,
    url: `${baseUrl}${location}?lang=${lang}`
  }));

  useEffect(() => {
    // Update title
    document.title = pageTitle;

    // Update or create meta tags
    const updateMeta = (property: string, content: string, isProperty = false) => {
      const attr = isProperty ? 'property' : 'name';
      let element = document.querySelector(`meta[${attr}="${property}"]`);
      
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attr, property);
        document.head.appendChild(element);
      }
      
      element.setAttribute('content', content);
    };

    // Update or create link tags
    const updateLink = (rel: string, href: string, hreflang?: string) => {
      const selector = hreflang 
        ? `link[rel="${rel}"][hreflang="${hreflang}"]`
        : `link[rel="${rel}"]`;
      
      let element = document.querySelector(selector);
      
      if (!element) {
        element = document.createElement('link');
        element.setAttribute('rel', rel);
        if (hreflang) element.setAttribute('hreflang', hreflang);
        document.head.appendChild(element);
      }
      
      element.setAttribute('href', href);
    };

    // Canonical URL
    updateLink('canonical', canonicalUrl);

    // hreflang tags for multi-language SEO
    alternateUrls.forEach(({ lang, url }) => {
      updateLink('alternate', url, lang);
    });
    // x-default for international targeting
    updateLink('alternate', `${baseUrl}${location}`, 'x-default');

    // Standard meta tags
    updateMeta('description', pageDescription);
    updateMeta('language', i18n.language);

    // Open Graph tags
    updateMeta('og:title', pageTitle, true);
    updateMeta('og:description', pageDescription, true);
    updateMeta('og:image', pageImage, true);
    updateMeta('og:url', canonicalUrl, true);
    updateMeta('og:type', 'website', true);
    updateMeta('og:site_name', 'DentalSecondOpinion', true);
    
    // Locale variations
    const ogLocale = i18n.language === 'de' ? 'de_CH' : 
                     i18n.language === 'fr' ? 'fr_CH' : 
                     i18n.language === 'it' ? 'it_CH' : 'en_US';
    updateMeta('og:locale', ogLocale, true);
    
    // Alternate locales
    const alternateLocales = ['de_CH', 'en_US', 'fr_CH', 'it_CH'].filter(l => l !== ogLocale);
    alternateLocales.forEach((locale, index) => {
      updateMeta(`og:locale:alternate`, locale, true);
    });

    // Twitter Card tags
    updateMeta('twitter:card', 'summary_large_image');
    updateMeta('twitter:title', pageTitle);
    updateMeta('twitter:description', pageDescription);
    updateMeta('twitter:image', pageImage);

    // Additional SEO tags
    updateMeta('keywords', 'dental second opinion, zahnarzt zweitmeinung, dentiste deuxième avis, dentista secondo parere, dental cost savings, zahnbehandlung kosten sparen, dental analysis, tooth pain, treatment review');
    updateMeta('author', 'DentalSecondOpinion');
    updateMeta('robots', 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1');
    updateMeta('googlebot', 'index, follow');
    
    // Mobile optimization
    updateMeta('viewport', 'width=device-width, initial-scale=1, maximum-scale=5');
    updateMeta('theme-color', '#0ea5e9');
    
    // Geo targeting for Switzerland
    updateMeta('geo.region', 'CH');
    updateMeta('geo.placename', 'Switzerland');
  }, [pageTitle, pageDescription, pageImage, canonicalUrl, i18n.language, location, alternateUrls, baseUrl]);

  return null;
}
