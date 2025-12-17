import { writeFileSync, existsSync, mkdirSync } from 'fs';
import { dirname } from 'path';

const configs = [
  {
    path: '.nuxt/tsconfig.app.json',
    content: {
      "extends": "./tsconfig.json",
      "compilerOptions": {
        "composite": true,
        "types": []
      }
    }
  },
  {
    path: '.nuxt/tsconfig.shared.json',
    content: {
      "extends": "./tsconfig.json",
      "compilerOptions": {
        "composite": true,
        "types": []
      }
    }
  },
  {
    path: '.nuxt/tsconfig.node.json',
    content: {
      "extends": "./tsconfig.json",
      "compilerOptions": {
        "composite": true,
        "module": "ESNext",
        "moduleResolution": "Bundler",
        "types": ["node"]
      }
    }
  }
];

configs.forEach(({ path, content }) => {
  const dir = dirname(path);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
    console.log(`Created directory ${dir}`);
  }

  // Always write the file to ensure it exists with correct content
  writeFileSync(path, JSON.stringify(content, null, 2));
  console.log(`✓ Created/Updated ${path}`);

  // Verify it exists
  if (existsSync(path)) {
    console.log(`✓ Verified ${path} exists`);
  } else {
    console.error(`✗ ERROR: ${path} does not exist after creation!`);
    process.exit(1);
  }
});
