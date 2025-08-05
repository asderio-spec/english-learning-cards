#!/usr/bin/env node

/**
 * Bundle size analyzer and monitoring script
 * 번들 크기 분석 및 모니터링 스크립트
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Target bundle sizes in KB
const SIZE_LIMITS = {
  main: 250,
  vendor: 200,
  chunk: 100,
  css: 50,
  total: 500,
};

// Performance budget
const PERFORMANCE_BUDGET = {
  javascript: 250, // KB
  css: 50, // KB
  images: 100, // KB
  fonts: 30, // KB
  total: 430, // KB
};

/**
 * Get file size in KB
 */
function getFileSizeKB(filePath) {
  try {
    const stats = fs.statSync(filePath);
    return Math.round(stats.size / 1024);
  } catch (error) {
    return 0;
  }
}

/**
 * Get all files in directory with extension
 */
function getFilesWithExtension(dir, extension) {
  if (!fs.existsSync(dir)) return [];
  
  return fs.readdirSync(dir)
    .filter(file => file.endsWith(extension))
    .map(file => path.join(dir, file));
}

/**
 * Analyze bundle sizes
 */
function analyzeBundleSizes() {
  const distDir = path.join(__dirname, '../dist');
  const assetsDir = path.join(distDir, 'assets');
  
  if (!fs.existsSync(distDir)) {
    console.error('❌ Dist directory not found. Run "npm run build" first.');
    process.exit(1);
  }

  // Get all JavaScript files
  const jsFiles = getFilesWithExtension(assetsDir, '.js');
  const cssFiles = getFilesWithExtension(assetsDir, '.css');
  const imageFiles = [
    ...getFilesWithExtension(path.join(assetsDir, 'images'), '.webp'),
    ...getFilesWithExtension(path.join(assetsDir, 'images'), '.jpg'),
    ...getFilesWithExtension(path.join(assetsDir, 'images'), '.png'),
    ...getFilesWithExtension(path.join(assetsDir, 'images'), '.svg'),
  ];
  const fontFiles = [
    ...getFilesWithExtension(assetsDir, '.woff2'),
    ...getFilesWithExtension(assetsDir, '.woff'),
  ];

  // Analyze JavaScript bundles
  const jsBundles = jsFiles.map(file => {
    const fileName = path.basename(file);
    const size = getFileSizeKB(file);
    
    let type = 'chunk';
    if (fileName.includes('index')) type = 'main';
    else if (fileName.includes('vendor') || fileName.includes('react')) type = 'vendor';
    
    return { file: fileName, size, type };
  });

  // Analyze CSS bundles
  const cssBundles = cssFiles.map(file => ({
    file: path.basename(file),
    size: getFileSizeKB(file),
    type: 'css',
  }));

  // Calculate totals
  const totalJS = jsBundles.reduce((sum, bundle) => sum + bundle.size, 0);
  const totalCSS = cssBundles.reduce((sum, bundle) => sum + bundle.size, 0);
  const totalImages = imageFiles.reduce((sum, file) => sum + getFileSizeKB(file), 0);
  const totalFonts = fontFiles.reduce((sum, file) => sum + getFileSizeKB(file), 0);
  const totalSize = totalJS + totalCSS + totalImages + totalFonts;

  return {
    bundles: {
      javascript: jsBundles,
      css: cssBundles,
    },
    totals: {
      javascript: totalJS,
      css: totalCSS,
      images: totalImages,
      fonts: totalFonts,
      total: totalSize,
    },
    files: {
      javascript: jsFiles.length,
      css: cssFiles.length,
      images: imageFiles.length,
      fonts: fontFiles.length,
    },
  };
}

/**
 * Check if sizes are within limits
 */
function checkSizeLimits(analysis) {
  const warnings = [];
  const errors = [];

  // Check individual bundle limits
  analysis.bundles.javascript.forEach(bundle => {
    const limit = SIZE_LIMITS[bundle.type] || SIZE_LIMITS.chunk;
    if (bundle.size > limit) {
      errors.push(`❌ ${bundle.file}: ${bundle.size}KB exceeds ${limit}KB limit`);
    } else if (bundle.size > limit * 0.8) {
      warnings.push(`⚠️  ${bundle.file}: ${bundle.size}KB is close to ${limit}KB limit`);
    }
  });

  // Check CSS limits
  analysis.bundles.css.forEach(bundle => {
    if (bundle.size > SIZE_LIMITS.css) {
      errors.push(`❌ ${bundle.file}: ${bundle.size}KB exceeds ${SIZE_LIMITS.css}KB limit`);
    } else if (bundle.size > SIZE_LIMITS.css * 0.8) {
      warnings.push(`⚠️  ${bundle.file}: ${bundle.size}KB is close to ${SIZE_LIMITS.css}KB limit`);
    }
  });

  // Check performance budget
  Object.entries(PERFORMANCE_BUDGET).forEach(([type, limit]) => {
    const actual = analysis.totals[type];
    if (actual > limit) {
      errors.push(`❌ Total ${type}: ${actual}KB exceeds ${limit}KB budget`);
    } else if (actual > limit * 0.8) {
      warnings.push(`⚠️  Total ${type}: ${actual}KB is close to ${limit}KB budget`);
    }
  });

  return { warnings, errors };
}

/**
 * Generate recommendations
 */
function generateRecommendations(analysis) {
  const recommendations = [];

  // Large JavaScript bundles
  const largeJSBundles = analysis.bundles.javascript.filter(b => b.size > 100);
  if (largeJSBundles.length > 0) {
    recommendations.push('Consider code splitting for large JavaScript bundles');
    recommendations.push('Implement lazy loading for non-critical components');
  }

  // Large CSS bundles
  const largeCSSBundles = analysis.bundles.css.filter(b => b.size > 30);
  if (largeCSSBundles.length > 0) {
    recommendations.push('Enable CSS purging to remove unused styles');
    recommendations.push('Consider critical CSS extraction');
  }

  // Too many chunks
  if (analysis.files.javascript > 10) {
    recommendations.push('Consider consolidating small chunks to reduce HTTP requests');
  }

  // Large total size
  if (analysis.totals.total > PERFORMANCE_BUDGET.total) {
    recommendations.push('Overall bundle size is too large - consider aggressive optimization');
    recommendations.push('Implement tree shaking to remove unused code');
    recommendations.push('Use dynamic imports for feature-based code splitting');
  }

  // Image optimization
  if (analysis.totals.images > PERFORMANCE_BUDGET.images) {
    recommendations.push('Optimize images with WebP format and responsive sizes');
    recommendations.push('Implement lazy loading for images');
  }

  return recommendations;
}

/**
 * Print analysis report
 */
function printReport(analysis) {
  console.log('\n📊 Bundle Size Analysis Report');
  console.log('================================\n');

  // Bundle breakdown
  console.log('📦 JavaScript Bundles:');
  analysis.bundles.javascript.forEach(bundle => {
    const status = bundle.size > (SIZE_LIMITS[bundle.type] || SIZE_LIMITS.chunk) ? '❌' : '✅';
    console.log(`  ${status} ${bundle.file}: ${bundle.size}KB (${bundle.type})`);
  });

  console.log('\n🎨 CSS Bundles:');
  analysis.bundles.css.forEach(bundle => {
    const status = bundle.size > SIZE_LIMITS.css ? '❌' : '✅';
    console.log(`  ${status} ${bundle.file}: ${bundle.size}KB`);
  });

  // Totals
  console.log('\n📈 Size Totals:');
  Object.entries(analysis.totals).forEach(([type, size]) => {
    const budget = PERFORMANCE_BUDGET[type];
    const status = budget && size > budget ? '❌' : '✅';
    const budgetText = budget ? ` / ${budget}KB` : '';
    console.log(`  ${status} ${type}: ${size}KB${budgetText}`);
  });

  // File counts
  console.log('\n📁 File Counts:');
  Object.entries(analysis.files).forEach(([type, count]) => {
    console.log(`  ${type}: ${count} files`);
  });

  // Check limits
  const { warnings, errors } = checkSizeLimits(analysis);

  if (errors.length > 0) {
    console.log('\n🚨 Errors:');
    errors.forEach(error => console.log(`  ${error}`));
  }

  if (warnings.length > 0) {
    console.log('\n⚠️  Warnings:');
    warnings.forEach(warning => console.log(`  ${warning}`));
  }

  // Recommendations
  const recommendations = generateRecommendations(analysis);
  if (recommendations.length > 0) {
    console.log('\n💡 Recommendations:');
    recommendations.forEach(rec => console.log(`  • ${rec}`));
  }

  // Summary
  const isWithinBudget = analysis.totals.total <= PERFORMANCE_BUDGET.total;
  const statusIcon = isWithinBudget ? '✅' : '❌';
  const statusText = isWithinBudget ? 'WITHIN BUDGET' : 'EXCEEDS BUDGET';
  
  console.log(`\n${statusIcon} Summary: ${analysis.totals.total}KB total - ${statusText}`);
  
  if (!isWithinBudget) {
    const excess = analysis.totals.total - PERFORMANCE_BUDGET.total;
    console.log(`   Need to reduce by ${excess}KB to meet performance budget`);
  }

  console.log('\n');

  // Exit with error code if budget exceeded
  if (errors.length > 0) {
    process.exit(1);
  }
}

/**
 * Save analysis to JSON file
 */
function saveAnalysis(analysis) {
  const reportPath = path.join(__dirname, '../dist/bundle-analysis.json');
  const report = {
    timestamp: new Date().toISOString(),
    analysis,
    limits: SIZE_LIMITS,
    budget: PERFORMANCE_BUDGET,
  };

  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`📄 Detailed analysis saved to: ${reportPath}`);
}

/**
 * Main function
 */
function main() {
  try {
    const analysis = analyzeBundleSizes();
    printReport(analysis);
    saveAnalysis(analysis);
  } catch (error) {
    console.error('❌ Error analyzing bundle sizes:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { analyzeBundleSizes, checkSizeLimits, generateRecommendations };