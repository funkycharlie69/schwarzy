import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const publicDir = join(__dirname, '..', 'public');

const sizes = [192, 512];

async function generateIcons() {
  const sourceImage = join(publicDir, 'SCHWARZY.png');

  for (const size of sizes) {
    await sharp(sourceImage)
      .resize(size, size, {
        fit: 'contain',
        background: { r: 9, g: 9, b: 11, alpha: 1 } // zinc-950
      })
      .toFile(join(publicDir, `icon-${size}x${size}.png`));

    console.log(`✓ Generated icon-${size}x${size}.png`);
  }

  console.log('✓ All icons generated successfully!');
}

generateIcons().catch(console.error);
