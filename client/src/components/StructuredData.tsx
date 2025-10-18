import { useTranslation } from 'react-i18next';

interface StructuredDataProps {
  type?: 'organization' | 'service' | 'medical';
}

export function StructuredData({ type = 'organization' }: StructuredDataProps) {
  const { i18n } = useTranslation();

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "MedicalBusiness",
    "name": "DentalSecondOpinion",
    "description": "Professional dental second opinion service with AI-powered analysis and expert dentist reviews",
    "url": "https://dentalsecondopinion.ch",
    "logo": "https://dentalsecondopinion.ch/logo.png",
    "image": "https://dentalsecondopinion.ch/og-image.jpg",
    "telephone": "+41-XX-XXX-XXXX",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "CH",
      "addressRegion": "Schweiz"
    },
    "priceRange": "9.90 CHF - 60 CHF",
    "currenciesAccepted": "CHF",
    "paymentAccepted": "Credit Card, Stripe",
    "openingHours": "Mo-Su 00:00-23:59",
    "areaServed": [
      {
        "@type": "Country",
        "name": "Switzerland"
      },
      {
        "@type": "Country",
        "name": "Germany"
      },
      {
        "@type": "Country",
        "name": "Austria"
      }
    ],
    "knowsLanguage": ["de", "en", "fr", "it"],
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "12000",
      "bestRating": "5",
      "worstRating": "1"
    }
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "MedicalProcedure",
    "name": "Dental Second Opinion Service",
    "description": "Get professional dental second opinions through AI-powered analysis and expert dentist reviews. Save money on dental treatments with independent, neutral advice.",
    "procedureType": "Diagnostic",
    "medicineSystem": "Dentistry",
    "status": "Active",
    "availableService": [
      {
        "@type": "MedicalTherapy",
        "name": "AI Dental Analysis",
        "description": "AI-powered analysis of dental images and treatment offers",
        "offers": {
          "@type": "Offer",
          "price": "9.90",
          "priceCurrency": "CHF",
          "availability": "https://schema.org/InStock",
          "url": "https://dentalsecondopinion.ch"
        }
      },
      {
        "@type": "MedicalTherapy",
        "name": "Professional Dentist Review",
        "description": "Expert review by licensed dental professionals",
        "offers": {
          "@type": "Offer",
          "price": "60.00",
          "priceCurrency": "CHF",
          "availability": "https://schema.org/InStock",
          "url": "https://dentalsecondopinion.ch"
        }
      }
    ]
  };

  const medicalWebsiteSchema = {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    "name": "DentalSecondOpinion - Professional Dental Second Opinions",
    "description": "Get professional dental second opinions for only 9.90 CHF. AI-powered analysis and expert dentist reviews. Save money on dental treatments.",
    "url": "https://dentalsecondopinion.ch",
    "inLanguage": [i18n.language],
    "audience": {
      "@type": "PatientsHealthAudience",
      "healthCondition": "Dental health concerns"
    },
    "about": {
      "@type": "MedicalCondition",
      "name": "Dental Health",
      "alternateName": ["Tooth problems", "Dental treatment", "Dental diagnosis"]
    },
    "specialty": "Dentistry",
    "mainEntity": {
      "@type": "Question",
      "name": "Should I get a second opinion on my dental treatment?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, getting a second opinion can help you make informed decisions about dental treatments, potentially save money, and ensure you receive the most appropriate care."
      }
    }
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://dentalsecondopinion.ch"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Upload",
        "item": "https://dentalsecondopinion.ch/upload"
      }
    ]
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How much does a dental second opinion cost?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Our AI-powered analysis costs only 9.90 CHF, while a professional dentist review costs 60 CHF."
        }
      },
      {
        "@type": "Question",
        "name": "How long does it take to get results?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "AI analysis is completed within minutes. Professional dentist reviews are delivered within 24 hours."
        }
      },
      {
        "@type": "Question",
        "name": "What types of dental images can I upload?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "You can upload X-rays, OPT scans, CBCT scans, DICOM files, treatment offers, and photos in JPEG, PNG, or PDF format."
        }
      },
      {
        "@type": "Question",
        "name": "Is the service anonymous?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, you can upload images anonymously. Authentication is only required when making a payment."
        }
      }
    ]
  };

  let schemas;
  switch (type) {
    case 'service':
      schemas = [organizationSchema, serviceSchema, faqSchema];
      break;
    case 'medical':
      schemas = [organizationSchema, medicalWebsiteSchema, breadcrumbSchema];
      break;
    default:
      schemas = [organizationSchema, serviceSchema, medicalWebsiteSchema, faqSchema];
  }

  return (
    <>
      {schemas.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
}
