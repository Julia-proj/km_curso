// Convert large PNG images to WebP format
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const IMAGES_DIR = path.join(__dirname, '../public/images');
const SIZE_THRESHOLD_KB = 500;

async function convertToWebP(inputPath, outputPath) {
  try {
    await sharp(inputPath)
      .webp({ quality: 85, effort: 6 })
      .toFile(outputPath);
    
    const originalSize = fs.statSync(inputPath).size;
    const newSize = fs.statSync(outputPath).size;
    const savings = ((originalSize - newSize) / originalSize * 100).toFixed(1);
    
    console.log(`✓ ${path.basename(inputPath)} → ${path.basename(outputPath)} (${savings}% reduction)`);
    return true;
  } catch (error) {
    console.error(`✗ Error converting ${inputPath}:`, error.message);
    return false;
  }
}

async function processDirectory(dir) {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  let converted = 0;

  for (const file of files) {
    const fullPath = path.join(dir, file.name);
    
    if (file.isDirectory()) {
      converted += await processDirectory(fullPath);
    } else if (/\.(png|PNG|jpg|jpeg|JPG|JPEG)$/i.test(file.name)) {
      const fileStats = fs.statSync(fullPath);
      const sizeKB = Math.round(fileStats.size / 1024);
      
      // Only convert large files or PNG files that don't have WebP versions
      const webpPath = fullPath.replace(/\.(png|PNG|jpg|jpeg|JPG|JPEG)$/i, '.webp');
      const needsConversion = sizeKB > SIZE_THRESHOLD_KB || (!fs.existsSync(webpPath) && /\.(png|PNG)$/i.test(file.name));
      
      if (needsConversion && !fs.existsSync(webpPath)) {
        const success = await convertToWebP(fullPath, webpPath);
        if (success) converted++;
      }
    }
  }

  return converted;
}

async function main() {
  console.log('🔄 Converting images to WebP...\n');
  
  const converted = await processDirectory(IMAGES_DIR);
  
  console.log(`\n✅ Converted ${converted} images to WebP format`);
  console.log('💡 Remember to update image references in your code to use .webp files');
}

main().catch(console.error);
