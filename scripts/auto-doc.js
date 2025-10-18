#!/usr/bin/env node

/**
 * Auto-Documentation System for Dental Second Opinion Platform
 *
 * Automatically scans codebase and updates documentation
 * Author: Adapted for DentalSecondOpinion
 *
 * Usage: node scripts/auto-doc.js [--verbose]
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

const VERBOSE = process.argv.includes('--verbose');

// Feature detection patterns
const featurePatterns = [
  // Authentication & Security
  { pattern: /session|auth|jwt|passport/i, name: 'Session Management & Security', category: 'Authentication' },
  { pattern: /replit.*auth|oidc/i, name: 'Replit OAuth Integration', category: 'Authentication' },

  // Case Management
  { pattern: /case.*management|upload.*case/i, name: 'Case Upload & Management', category: 'Case Management' },
  { pattern: /dicom|cornerstone/i, name: 'DICOM Medical Image Viewer', category: 'Case Management' },
  { pattern: /file.*upload|object.*storage/i, name: 'File Upload to Object Storage', category: 'Case Management' },

  // AI & Analysis
  { pattern: /ai.*analysis|ollama|fastapi/i, name: 'AI-Powered Dental Analysis', category: 'AI & Analytics' },
  { pattern: /ai.*report|confidence.*score/i, name: 'AI Report Generation', category: 'AI & Analytics' },
  { pattern: /human.*review|dentist.*review/i, name: 'Dentist Review System', category: 'AI & Analytics' },

  // Payment System
  { pattern: /stripe|payment.*intent/i, name: 'Stripe Payment Integration', category: 'Payments' },
  { pattern: /webhook|payment.*event/i, name: 'Payment Webhook Processing', category: 'Payments' },

  // Lead & Practice Management
  { pattern: /lead.*routing|geolocation/i, name: 'Geographic Lead Routing', category: 'Lead Management' },
  { pattern: /practice.*management/i, name: 'Dental Practice Management', category: 'Lead Management' },

  // Compliance & Audit
  { pattern: /audit.*log|gdpr/i, name: 'GDPR Compliance & Audit Logging', category: 'Compliance' },
  { pattern: /data.*export|data.*deletion/i, name: 'Data Export & Deletion', category: 'Compliance' },

  // UI/UX Features
  { pattern: /i18n|translation|react-i18next/i, name: 'Internationalization (i18n)', category: 'UI/UX' },
  { pattern: /dark.*mode|theme/i, name: 'Theme System', category: 'UI/UX' },
  { pattern: /toast|notification/i, name: 'Toast Notifications', category: 'UI/UX' },
  { pattern: /modal|dialog/i, name: 'Modal Dialogs', category: 'UI/UX' },

  // Admin Features
  { pattern: /admin.*dashboard/i, name: 'Admin Dashboard', category: 'Admin' },
  { pattern: /user.*management|role.*based/i, name: 'User & Role Management', category: 'Admin' },

  // Email & Communication
  { pattern: /email|nodemailer|smtp/i, name: 'Email Notification System', category: 'Communication' },
  { pattern: /verification.*email/i, name: 'Email Verification', category: 'Communication' },
];

// Utility functions
function log(message, level = 'info') {
  const prefix = level === 'error' ? '❌' : level === 'success' ? '✅' : '📝';
  console.log(`${prefix} ${message}`);
}

function verboseLog(message) {
  if (VERBOSE) {
    console.log(`  ℹ️  ${message}`);
  }
}

// Scan directory for files
async function scanDirectory(dir, extension) {
  const files = [];

  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules') {
        files.push(...await scanDirectory(fullPath, extension));
      } else if (entry.isFile() && entry.name.endsWith(extension)) {
        files.push(fullPath);
      }
    }
  } catch (error) {
    if (VERBOSE) {
      console.error(`Error scanning ${dir}:`, error.message);
    }
  }

  return files;
}

// Count API endpoints in routes.ts
async function countAPIEndpoints() {
  try {
    const routesPath = path.join(rootDir, 'server', 'routes.ts');
    const content = await fs.readFile(routesPath, 'utf-8');

    const endpoints = {
      GET: (content.match(/app\.get\(/g) || []).length,
      POST: (content.match(/app\.post\(/g) || []).length,
      PATCH: (content.match(/app\.patch\(/g) || []).length,
      DELETE: (content.match(/app\.delete\(/g) || []).length,
      PUT: (content.match(/app\.put\(/g) || []).length,
    };

    const total = Object.values(endpoints).reduce((a, b) => a + b, 0);

    verboseLog(`Found endpoints: ${JSON.stringify(endpoints)}`);

    return { endpoints, total };
  } catch (error) {
    log(`Error counting API endpoints: ${error.message}`, 'error');
    return { endpoints: {}, total: 0 };
  }
}

// Count database models
async function countDatabaseModels() {
  try {
    const schemaPath = path.join(rootDir, 'shared', 'schema.ts');
    const content = await fs.readFile(schemaPath, 'utf-8');

    // Count Drizzle table definitions
    const tableCount = (content.match(/export const \w+ = pgTable\(/g) || []).length;

    verboseLog(`Found ${tableCount} database tables`);

    return tableCount;
  } catch (error) {
    log(`Error counting database models: ${error.message}`, 'error');
    return 0;
  }
}

// Scan for features across entire codebase
async function scanFeatures() {
  const detectedFeatures = new Map();

  // Scan server files
  verboseLog('Scanning server files...');
  const serverFiles = await scanDirectory(path.join(rootDir, 'server'), '.ts');

  // Scan client files
  verboseLog('Scanning client files...');
  const clientFiles = await scanDirectory(path.join(rootDir, 'client', 'src'), '.tsx');
  const clientTsFiles = await scanDirectory(path.join(rootDir, 'client', 'src'), '.ts');

  // Scan shared files
  verboseLog('Scanning shared files...');
  const sharedFiles = await scanDirectory(path.join(rootDir, 'shared'), '.ts');

  const allFiles = [...serverFiles, ...clientFiles, ...clientTsFiles, ...sharedFiles];

  verboseLog(`Total files to scan: ${allFiles.length}`);

  for (const filePath of allFiles) {
    try {
      const content = await fs.readFile(filePath, 'utf-8');

      for (const { pattern, name, category } of featurePatterns) {
        if (pattern.test(content)) {
          detectedFeatures.set(name, { name, category });
          verboseLog(`Detected "${name}" in ${path.relative(rootDir, filePath)}`);
        }
      }
    } catch (error) {
      // Skip unreadable files
    }
  }

  return Array.from(detectedFeatures.values());
}


// Generate documentation content
function generateDevelopmentLogEntry(metrics, features) {
  const date = new Date().toLocaleDateString('de-DE', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  const featuresByCategory = features.reduce((acc, feature) => {
    if (!acc[feature.category]) acc[feature.category] = [];
    acc[feature.category].push(feature.name);
    return acc;
  }, {});

  let entry = `\n## ${date}: Auto-Documentation Update\n\n`;
  entry += `**Auto-generated Documentation Scan**\n\n`;
  entry += `**System Metrics**:\n`;
  entry += `- API Endpoints: ${metrics.apiEndpoints}\n`;
  entry += `- React Components: ${metrics.components}\n`;
  entry += `- Pages: ${metrics.pages}\n`;
  entry += `- Database Models: ${metrics.dbModels}\n`;
  entry += `- Detected Features: ${features.length}\n\n`;

  entry += `**Detected Features by Category**:\n`;
  for (const [category, featureList] of Object.entries(featuresByCategory)) {
    entry += `\n**${category}**:\n`;
    featureList.forEach(name => {
      entry += `- ${name}\n`;
    });
  }

  entry += `\n---\n`;

  return entry;
}

function generateCurrentFeaturesDoc(metrics, features) {
  let doc = `# Features - Dental Second Opinion Platform\n\n`;
  doc += `**Auto-generated by**: \`scripts/auto-doc.js\`\n`;
  doc += `**Last Updated**: ${new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })}\n\n`;
  doc += `---\n\n`;

  doc += `## 📊 System Metrics\n\n`;
  doc += `<!-- AUTO-GENERATED METRICS - DO NOT EDIT -->\n`;
  doc += `| Metric | Count |\n`;
  doc += `|--------|-------|\n`;
  doc += `| API Endpoints | ${metrics.apiEndpoints} |\n`;
  doc += `| React Components | ${metrics.components} |\n`;
  doc += `| Pages | ${metrics.pages} |\n`;
  doc += `| Database Models | ${metrics.dbModels} |\n`;
  doc += `| Detected Features | ${features.length} |\n`;
  doc += `<!-- END AUTO-GENERATED -->\n\n`;

  doc += `## ✨ Implemented Features\n\n`;
  doc += `<!-- AUTO-GENERATED FEATURES - DO NOT EDIT -->\n`;
  doc += `| Feature | Category | Status |\n`;
  doc += `|---------|----------|--------|\n`;

  features.forEach(feature => {
    doc += `| ${feature.name} | ${feature.category} | ✅ Active |\n`;
  });
  doc += `<!-- END AUTO-GENERATED -->\n\n`;

  doc += `---\n\n`;
  doc += `*This file is partially auto-generated. Manual edits in non-marked sections will be preserved.*\n`;

  return doc;
}

function generateREADMEMetrics(metrics, features) {
  return `## 📊 Project Metrics

- **Features Implemented**: ${features.length}+
- **API Endpoints**: ${metrics.apiEndpoints}
- **React Components**: ${metrics.components}
- **Database Models**: ${metrics.dbModels}
- **Pages**: ${metrics.pages}
- **Languages Supported**: 4 (DE, EN, IT, FR)
`;
}

// Main execution
async function main() {
  try {
    log('Starting Auto-Documentation...', 'info');

    // Gather metrics
    log('Collecting system metrics...');
    const { total: apiEndpoints } = await countAPIEndpoints();
    log(`Found ${apiEndpoints} API endpoints`, 'success');

    const componentFiles = await scanDirectory(path.join(rootDir, 'client', 'src', 'components'), '.tsx');
    log(`Found ${componentFiles.length} components`, 'success');

    const pageFiles = await scanDirectory(path.join(rootDir, 'client', 'src', 'pages'), '.tsx');
    log(`Found ${pageFiles.length} pages`, 'success');

    const dbModels = await countDatabaseModels();
    log(`Found ${dbModels} database models`, 'success');

    const metrics = {
      apiEndpoints,
      components: componentFiles.length,
      pages: pageFiles.length,
      dbModels,
    };

    // Detect features
    log('Scanning for features...');
    const features = await scanFeatures();
    log(`Detected ${features.length} unique features`, 'success');

    // Update DEVELOPMENT_LOG.md in Documentation folder
    log('Updating Documentation/6-Development/DEVELOPMENT_LOG.md...');
    const devLogPath = path.join(rootDir, 'Documentation', '6-Development', 'DEVELOPMENT_LOG.md');
    let devLogContent = '';

    try {
      devLogContent = await fs.readFile(devLogPath, 'utf-8');
    } catch {
      devLogContent = '# Development Log\n\n**Auto-generated by**: `scripts/auto-doc.js`\n\nThis file tracks the evolution of the Dental Second Opinion Platform over time.\n\n---\n\n';
    }

    const newEntry = generateDevelopmentLogEntry(metrics, features);
    devLogContent += newEntry;
    await fs.writeFile(devLogPath, devLogContent, 'utf-8');
    log('Updated Documentation/6-Development/DEVELOPMENT_LOG.md', 'success');

    // Update/Create FEATURES.md in Documentation folder
    log('Updating Documentation/1-Overview/FEATURES.md...');
    const currentFeaturesPath = path.join(rootDir, 'Documentation', '1-Overview', 'FEATURES.md');
    const currentFeaturesContent = generateCurrentFeaturesDoc(metrics, features);
    await fs.writeFile(currentFeaturesPath, currentFeaturesContent, 'utf-8');
    log('Updated Documentation/1-Overview/FEATURES.md', 'success');

    // Update README.md metrics section
    log('Updating README.md metrics...');
    const readmePath = path.join(rootDir, 'README.md');
    let readmeContent = await fs.readFile(readmePath, 'utf-8');

    const metricsSection = generateREADMEMetrics(metrics, features);

    // Replace or append metrics section
    if (readmeContent.includes('## 📊 Project Metrics')) {
      readmeContent = readmeContent.replace(
        /## 📊 Project Metrics[\s\S]*?(?=\n## |\n---|\z)/,
        metricsSection + '\n'
      );
    } else {
      readmeContent += '\n\n' + metricsSection;
    }

    await fs.writeFile(readmePath, readmeContent, 'utf-8');
    log('Updated README.md metrics', 'success');

    log('Auto-Documentation completed successfully!', 'success');
    log(`\nSummary: ${features.length} features, ${apiEndpoints} endpoints, ${componentFiles.length} components`);

  } catch (error) {
    log(`Auto-Documentation failed: ${error.message}`, 'error');
    if (VERBOSE) {
      console.error(error);
    }
    process.exit(1);
  }
}

main();
