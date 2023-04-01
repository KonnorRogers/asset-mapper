import { test } from 'vitest'
// import * as path from 'path'
// import * as esbuild from "esbuild"
// import { ESBuildAssetMapper } from "../src/esbuild.js"
//
// /** @type {import("esbuild").BuildOptions} */
// const esbuildConfig = {
//   bundle: true,
//   splitting: true,
//   metafile: true,
//   format: "esm",
//   chunkNames: "chunks/[dir]/[name]-[hash]",
//   assetNames: "media/[dir]/[name]",
//   entryNames: "[dir]/[name]",
//   entryPoints: {
//     "app": path.join("tests/fixtures/entrypoints/app.js"),
//     "app2": path.join("tests/fixtures/entrypoints/app2.js")
//   },
//   loader: {
//     ".png": "file",
//     ".js": "jsx"
//   },
//   outdir: path.join(process.cwd(), "tmp"),
//   plugins: [ESBuildAssetMapper()]
// }

test.skip("Should put all files into a manifest", async () => {
  // await esbuild.build(esbuildConfig)
})
