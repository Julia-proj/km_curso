// Image Optimization Script
// This script helps identify images that need optimization

const fs = require('fs');
const path = require('path');

const IMAGES_DIR = path.join(__dirname, '../public/images');
const SIZE_THRESHOLD_KB = 500; // Images larger than 500KB

function getImageStats(dir) {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  const stats = [];

  for (const file of files) {
    const fullPath = path.join(dir, file.name);
    
    if (file.isDirectory()) {
      stats.push(...getImageStats(fullPath));
    } else if (/\.(png|jpg|jpeg|gif|PNG|JPG|JPEG|GIF)$/i.test(file.name)) {
      const fileStats = fs.statSync(fullPath);
      const sizeKB = Math.round(fileStats.size / 1024);
      
      stats.push({
        name: file.name,
        path: fullPath.replace(__dirname + '/../', ''),
        sizeKB,
        needsOptimization: sizeKB > SIZE_THRESHOLD_KB
      });
    }
  }

  return stats;
}

console.log('🔍 Analyzing images...\n');

const stats = getImageStats(IMAGES_DIR);
const needsOptimization = stats.filter(s => s.needsOptimization);
const totalSize = stats.reduce((sum, s) => sum + s.sizeKB, 0);

console.log(`📊 Total images: ${stats.length}`);
console.log(`💾 Total size: ${Math.round(totalSize / 1024)}MB`);
console.log(`⚠️  Images needing optimization: ${needsOptimization.length}\n`);

if (needsOptimization.length > 0) {
  console.log('🚨 Large images (>500KB):');
  needsOptimization
    .sort((a, b) => b.sizeKB - a.sizeKB)
    .forEach(img => {
      console.log(`   ${img.name} - ${img.sizeKB}KB`);
    });

  console.log('\n💡 Recommendations:');
  console.log('   1. Use online tools: https://squoosh.app/');
  console.log('   2. Convert to WebP format');
  console.log('   3. Use next/image component for automatic optimization');
  console.log('   4. Target size: <200KB for hero images, <100KB for others\n');
  
  console.log('📝 Potential savings: ~' + Math.round((totalSize * 0.7) / 1024) + 'MB');
}

module.exports = { getImageStats };
