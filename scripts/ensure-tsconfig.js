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
  }
  if (!existsSync(path)) {
    writeFileSync(path, JSON.stringify(content, null, 2));
    console.log(`Created ${path}`);
  }
});
