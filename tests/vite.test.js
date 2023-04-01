// @ts-check
import { test, assert } from "vitest";
import { build, mergeConfig } from "vite";
import { mkdtemp } from "node:fs/promises";
import * as path from "node:path";
import * as fs from "node:fs";
import { tmpdir } from "node:os";
import { RollupAssetMapper } from "../src/rollup.js";
import { globSync } from "glob";
import { vitest } from "vitest";
import { afterEach } from "vitest";
import { expect } from "vitest";

const fixtures = path.resolve(path.join(process.cwd(), "tests/fixtures"));
const entrypoints = path.join(fixtures, "entrypoints");

const defaultOptions = {
  root: process.cwd(),
  // base: tmpDirectory,

  build: {
    rollupOptions: {
      // ...
      input: {
        app: path.join(entrypoints, "app.js"),
        app2: path.join(entrypoints, "app2.js"),
        "nested/app": path.join(entrypoints, "nested/app.js"),
      },
      output: {
        entryFileNames: `[name].js`,
        chunkFileNames: `chunks/[name].js`,
        assetFileNames: `assets/[name].[ext]`,
      },
    },
  },

  plugins: [RollupAssetMapper()],
};

afterEach(() => {
  vitest.resetAllMocks();
});

test("Should generate a proper manifest with Vite", async () => {
  let tmpDirectory = "";
  try {
    tmpDirectory = await mkdtemp(path.join(tmpdir(), "vitest"));
    const overrides = { build: { outDir: tmpDirectory } };
    await build(mergeConfig(defaultOptions, overrides));
  } catch (e) {
    console.error(e);
  }

  const manifest = path.join(tmpDirectory, "asset-mapper-manifest.json");
  assert(fs.existsSync(manifest));

  const manifestJSON = JSON.parse(fs.readFileSync(manifest).toString());
  const files = globSync(path.join(tmpDirectory, "**/*.{js,css,png}"));

  expect(Object.keys(manifestJSON).length).toBeGreaterThan(0);

  files.forEach((file) => {
    let unhashedFile = path.relative(tmpDirectory, file);

    // Replaces our 16 character hash with the normalized name.
    unhashedFile = unhashedFile.replace(/-\S{16,16}(\..*)$/, "$1");

    /** @type {string} */
    const hashedFile = manifestJSON[unhashedFile];

    const { dir, name, ext } = path.parse(unhashedFile);

    const originalPath = path.join(dir, name);
    assert(hashedFile.startsWith(originalPath));

    expect(
      Boolean(hashedFile.match(new RegExp(`^${originalPath}-\\S{16}${ext}$`)))
    ).toEqual(true);
  });
});

test("Should produce a console warning if used with hashed assets", async () => {
  const spy = vitest.spyOn(console, "warn");

  spy.mockImplementation(() => {});

  let tmpDirectory = "";
  try {
    tmpDirectory = await mkdtemp(path.join(tmpdir(), "vitest"));
    const overrides = {
      build: {
        outDir: tmpDirectory,
        rollupOptions: {
          output: {
            entryFileNames: `[name]-[hash].js`,
            chunkFileNames: `chunks/[name]-[hash].js`,
            assetFileNames: `assets/[name]-[hash].[ext]`,
          },
        },
      },
    };
    await build(mergeConfig(defaultOptions, overrides));
  } catch (e) {
    console.error(e);
  }

  /** @param {string} str */
  const warningMessage = (str) =>
    new RegExp(`{${str}} contains the \\[hash\\] keyword`);

  let hashWarnings = 0;

  let warnings = ["entryFileNames", "assetFileNames", "chunkFileNames"];
  spy.mock.calls.forEach(([message]) => {
    warnings.forEach((str) => {
      if (message.match(warningMessage(str))) {
        hashWarnings++;
      }
    });
  });

  expect(hashWarnings).toEqual(3);
});
