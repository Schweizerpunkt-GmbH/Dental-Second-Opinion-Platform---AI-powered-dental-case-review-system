import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
}

export function SEO({ title, description, image, url }: SEOProps) {
  const { i18n } = useTranslation();
  
  const defaultTitle = "DentalSecondOpinion - Professional Dental Second Opinions";
  const defaultDescription = "Get professional dental second opinions for only 9.90 CHF. AI-powered analysis and expert dentist reviews. Save money on dental treatments with independent, neutral advice.";
  const defaultImage = "https://dentalsecondopinion.ch/og-image.jpg";
  const defaultUrl = "https://dentalsecondopinion.ch";

  const pageTitle = title ? `${title} | DentalSecondOpinion` : defaultTitle;
  const pageDescription = description || defaultDescription;
  const pageImage = image || defaultImage;
  const pageUrl = url || defaultUrl;

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

    // Standard meta tags
    updateMeta('description', pageDescription);
    updateMeta('language', i18n.language);

    // Open Graph tags
    updateMeta('og:title', pageTitle, true);
    updateMeta('og:description', pageDescription, true);
    updateMeta('og:image', pageImage, true);
    updateMeta('og:url', pageUrl, true);
    updateMeta('og:type', 'website', true);
    updateMeta('og:locale', i18n.language === 'de' ? 'de_CH' : i18n.language === 'fr' ? 'fr_CH' : i18n.language === 'it' ? 'it_CH' : 'en_US', true);

    // Twitter Card tags
    updateMeta('twitter:card', 'summary_large_image');
    updateMeta('twitter:title', pageTitle);
    updateMeta('twitter:description', pageDescription);
    updateMeta('twitter:image', pageImage);

    // Additional SEO tags
    updateMeta('keywords', 'dental second opinion, zahnarzt zweitmeinung, dentiste deuxième avis, dentista secondo parere, dental cost savings, zahnbehandlung kosten sparen');
    updateMeta('author', 'DentalSecondOpinion');
    updateMeta('robots', 'index, follow');
  }, [pageTitle, pageDescription, pageImage, pageUrl, i18n.language]);

  return null;
}
