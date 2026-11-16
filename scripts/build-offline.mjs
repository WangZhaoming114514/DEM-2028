import { build } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const tmpOutDir = path.join(rootDir, '.offline-build-tmp');
const distOutDir = path.join(rootDir, 'dist');
const outputFilename = 'DEMOCRATIC-2028.html';

async function main() {
  await fs.rm(tmpOutDir, { recursive: true, force: true });

  await build({
    root: rootDir,
    configFile: false,
    base: './',
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': rootDir,
      },
    },
    build: {
      outDir: tmpOutDir,
      emptyOutDir: true,
      assetsInlineLimit: 100 * 1024 * 1024,
      cssCodeSplit: false,
      minify: 'esbuild',
      rollupOptions: {
        input: path.join(rootDir, 'index.html'),
        output: {
          format: 'iife',
          name: 'Democratic2028App',
          inlineDynamicImports: true,
          entryFileNames: 'bundle.js',
          assetFileNames: 'asset-[name][extname]',
        },
      },
    },
  });

  const files = await fs.readdir(tmpOutDir);
  const cssFiles = files.filter((f) => f.endsWith('.css'));
  const jsFiles = files.filter((f) => f.endsWith('.js'));

  if (jsFiles.length !== 1) {
    throw new Error(`Expected exactly 1 IIFE JS bundle, found: ${jsFiles.join(', ')}`);
  }

  let cssContent = '';
  for (const cssFile of cssFiles) {
    cssContent += (await fs.readFile(path.join(tmpOutDir, cssFile), 'utf8')) + '\n';
  }
  const jsContent = await fs.readFile(path.join(tmpOutDir, jsFiles[0]), 'utf8');

  const sourceHtml = await fs.readFile(path.join(rootDir, 'index.html'), 'utf8');

  // Escape closing style/script tags inside inlined payloads safely
  const safeCss = cssContent.replace(/<\/style>/gi, '<\\/style>');
  const safeJs = jsContent.replace(/<\/script>/gi, '<\\/script>');

  let standaloneHtml = sourceHtml.replace(
    /<script\s+type="module"\s+src="\/src\/main\.tsx"\s*><\/script>/i,
    () => `<script>\n${safeJs}\n</script>`
  );

  standaloneHtml = standaloneHtml.replace(
    /<\/head>/i,
    () => `<style>\n${safeCss}</style>\n  </head>`
  );

  await fs.mkdir(distOutDir, { recursive: true });
  const rootOutputPath = path.join(rootDir, outputFilename);
  const distOutputPath = path.join(distOutDir, outputFilename);

  await fs.writeFile(rootOutputPath, standaloneHtml, 'utf8');
  await fs.writeFile(distOutputPath, standaloneHtml, 'utf8');
  await fs.rm(tmpOutDir, { recursive: true, force: true });

  const stats = await fs.stat(rootOutputPath);
  const sizeKb = Math.round(stats.size / 1024);
  console.log(`Built single-file offline HTML (${sizeKb} KB):`);
  console.log(`  - ${rootOutputPath}`);
  console.log(`  - ${distOutputPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
