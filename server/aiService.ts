import type { File } from "@shared/schema";

interface AIAnalysisResult {
  summary: string;
  findings: {
    condition: string;
    severity: "low" | "medium" | "high";
    description: string;
    recommendation: string;
    estimatedCostCHF?: number;
  }[];
  confidence: number;
  originalPriceCHF?: number;
  recommendedPriceCHF?: number;
  potentialSavingsCHF?: number;
}

export async function analyzeCase(
  caseId: string,
  symptoms: string,
  files: File[]
): Promise<AIAnalysisResult> {
  // Simulate AI processing delay
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Mock AI analysis based on symptoms and file types
  const hasXray = files.some(f => f.kind === 'RX' || f.kind === 'OPT');
  const hasCBCT = files.some(f => f.kind === 'CBCT' || f.kind === 'DVT');
  const hasOffer = files.some(f => f.kind === 'OFFER');

  const findings = [];
  
  // Generate findings based on file types
  if (hasXray) {
    findings.push({
      condition: "Dental Caries",
      severity: "medium" as const,
      description: "Multiple carious lesions detected in posterior teeth, particularly molars. Radiographic density suggests moderately advanced decay requiring intervention.",
      recommendation: "Recommend restorative treatment with composite fillings or inlays. Consider prophylactic fluoride treatment for remaining at-risk teeth.",
      estimatedCostCHF: 450
    });
  }

  if (hasCBCT) {
    findings.push({
      condition: "Bone Density Assessment",
      severity: "low" as const,
      description: "CBCT scan shows adequate bone density in mandibular region. No significant bone loss or pathology detected.",
      recommendation: "Suitable for implant placement if needed. Regular monitoring recommended.",
      estimatedCostCHF: 2800
    });
  }

  if (symptoms.toLowerCase().includes('pain')) {
    findings.push({
      condition: "Potential Pulpitis",
      severity: "high" as const,
      description: "Patient-reported pain symptoms combined with radiographic findings suggest possible pulpal involvement. Thermal sensitivity may be present.",
      recommendation: "Urgent dental examination required. May require endodontic treatment (root canal) or extraction depending on extent of damage.",
      estimatedCostCHF: 850
    });
  }

  if (symptoms.toLowerCase().includes('sensitivity')) {
    findings.push({
      condition: "Dentin Hypersensitivity",
      severity: "low" as const,
      description: "Sensitivity symptoms suggest exposed dentin or enamel erosion. Common causes include aggressive brushing or acidic diet.",
      recommendation: "Desensitizing toothpaste application. Consider fluoride varnish treatment. Address underlying causes.",
      estimatedCostCHF: 150
    });
  }

  // Default finding if no specific conditions detected
  if (findings.length === 0) {
    findings.push({
      condition: "Routine Dental Assessment",
      severity: "low" as const,
      description: "No acute pathology detected in available imaging. Regular dental maintenance appears adequate.",
      recommendation: "Continue routine dental hygiene. Schedule regular check-ups every 6 months.",
      estimatedCostCHF: 120
    });
  }

  // Calculate confidence based on available data
  let confidence = 0.75; // Base confidence
  if (hasXray) confidence += 0.1;
  if (hasCBCT) confidence += 0.1;
  if (files.length >= 3) confidence += 0.05;
  confidence = Math.min(confidence, 0.95); // Cap at 95%

  const summary = findings.length === 1
    ? findings[0].description
    : `Analysis of ${files.length} image(s) reveals ${findings.length} significant finding(s). ${findings[0].description}`;

  // Calculate pricing and savings
  const recommendedPriceCHF = findings.reduce((sum, f) => sum + (f.estimatedCostCHF || 0), 0);
  
  // If offer is present, simulate original price (typically higher)
  let originalPriceCHF: number | undefined;
  let potentialSavingsCHF: number | undefined;
  
  if (hasOffer) {
    // Simulate original offer price being 20-40% higher
    const markup = 1.25 + Math.random() * 0.15; // 1.25 to 1.40
    originalPriceCHF = Math.round(recommendedPriceCHF * markup);
    potentialSavingsCHF = originalPriceCHF - recommendedPriceCHF;
  }

  return {
    summary,
    findings,
    confidence,
    originalPriceCHF,
    recommendedPriceCHF,
    potentialSavingsCHF
  };
}

// Placeholder for future Ollama integration
export async function analyzeWithOllama(
  imageBase64: string,
  symptoms: string
): Promise<string> {
  // This would integrate with Ollama API in production
  // Example: POST to http://localhost:11434/api/generate
  // with model: "llava" or similar vision model
  
  throw new Error("Ollama integration not yet implemented. Using mock analysis.");
}
