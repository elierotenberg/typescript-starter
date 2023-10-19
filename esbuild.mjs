#!/usr/bin/env node

import esbuild from "esbuild";
import { glob } from "glob";

/**
 * @type {import("esbuild").BuildOptions}
 */
const base = {
  bundle: true,
  loader: {
    ".md": `text`,
  },
  minify: false,
  outbase: `src`,
  outdir: `build`,
  packages: `external`,
  sourcemap: true,
};

/**
 * @type {import("esbuild").BuildOptions}
 */
const cjs = {
  ...base,
  format: `cjs`,
  outExtension: {
    ".js": `.cjs`,
  },
};

/**
 * @type {import("esbuild").BuildOptions}
 */
const esm = {
  ...base,
  format: `esm`,
  outExtension: {
    ".js": `.mjs`,
  },
};

const testFiles = await glob(`./src/**/*.test.ts`);

await Promise.all(
  [esm, cjs].map((config) =>
    esbuild.build({
      ...config,
      entryPoints: [`./src/index.ts`, ...testFiles],
    }),
  ),
);
