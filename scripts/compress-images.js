const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const images = [
  {
    input: 'public/images/hero_screen_lesson.png',
    output: 'public/images/hero_screen_lesson.webp',
    width: 400
  },
  {
    input: 'public/images/salon1.JPG',
    output: 'public/images/salon1.webp',
    width: 600
  }
];

async function compressImages() {
  for (const img of images) {
    const inputPath = path.join(__dirname, '..', img.input);
    const outputPath = path.join(__dirname, '..', img.output);

    if (!fs.existsSync(inputPath)) {
      console.log(`❌ File not found: ${img.input}`);
      continue;
    }

    console.log(`🔧 Compressing ${img.input}...`);

    try {
      await sharp(inputPath)
        .resize(img.width, null, { withoutEnlargement: true })
        .webp({ quality: 75 })
        .toFile(outputPath);

      const originalSize = fs.statSync(inputPath).size / 1024;
      const newSize = fs.statSync(outputPath).size / 1024;
      const savings = ((originalSize - newSize) / originalSize * 100).toFixed(1);

      console.log(`✅ ${img.input}: ${originalSize.toFixed(0)}KB → ${newSize.toFixed(0)}KB (${savings}% savings)`);
    } catch (error) {
      console.error(`❌ Error compressing ${img.input}:`, error.message);
    }
  }

  console.log('\n💡 Next steps:');
  console.log('1. Update Image components to use .webp files');
  console.log('2. Test the changes');
  console.log('3. Delete original .JPG/.png files if satisfied');
}

compressImages().catch(console.error);
