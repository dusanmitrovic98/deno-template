import * as esbuild from 'https://deno.land/x/esbuild@v0.24.0/mod.js';

await esbuild.build({
  entryPoints: ['./index.ts'],
  bundle: true,
  outfile: './dist/bundle.js',
  format: 'esm',
  platform: 'neutral',
  target: 'deno1.0',
  external: ['https://deno.land/x/dotenv@v3.2.2/mod.ts'],
});

esbuild.stop();