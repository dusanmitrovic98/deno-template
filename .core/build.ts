import * as esbuild from 'https://deno.land/x/esbuild@v0.24.0/mod.js';
import * as path from "https://deno.land/std@0.208.0/path/mod.ts";

const currentDir = path.dirname(path.fromFileUrl(import.meta.url));

const projectRoot = path.resolve(currentDir, '..');
const entryPoint = path.resolve(projectRoot, 'index.ts');
const outFile = path.resolve(projectRoot, 'dist', 'bundle.js');

try {
  await esbuild.build({
    entryPoints: [entryPoint],
    bundle: true,
    outfile: outFile,
    format: 'esm',
    platform: 'neutral',
    target: 'deno1.0',
    external: ['https://deno.land/x/dotenv@v3.2.2/mod.ts'],
  });
  console.log('Build completed successfully!');
} catch (error) {
  console.error('Build failed:', error);
} finally {
  esbuild.stop();
}