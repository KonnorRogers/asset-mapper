// @ts-check
// Not possible until ESBuild allows named chunks.

// import path from "node:path"
// import fs from "fs/promises"

/**
 * @typedef {object} ESBuildAssetMapperOptions
 * @property {string} [manifestFile=""] - Where to output your manifest file
 */

/**
 * @param {ESBuildAssetMapperOptions} options
 * @returns {import("esbuild").Plugin}
 */
// export function ESBuildAssetMapper (options = {}) {
//   return {
//     name: "ESBuildAssetMapper",
//     setup (build) {
//       const { metafile, outfile, outdir } = build.initialOptions
//
//       ;["entryNames", "assetNames", "chunkNames"].forEach((str) => {
//         const val = build.initialOptions[str]
//         if (val && val.includes("[hash]")) {
//           console.warn(`
//             expected ${str} to not include the [hash] keyword. This plugin will hash for you.
//           `)
//         }
//       })
//
//       let { manifestFile } = options
//
//       if (metafile !== true) {
//         throw "In order to use ESBuildAssetMapper you must have `metafile: true` in your ESBuild config."
//       }
//
//       if (!manifestFile && outfile) {
//         manifestFile = path.join(path.dirname(outfile), "esbuild-manifest.json")
//       }
//
//       if (!manifestFile && outdir) {
//         manifestFile = path.join(outdir, "esbuild-manifest.json")
//       }
//
//       build.onEnd (async (result) => {
//         if (!result.metafile) {
//           console.warn(
//             "No metafile found from ESBuild. No manifest generated by ESBuildAssetMapper."
//           );
//           return;
//         }
//
//         if (!result.metafile.outputs) {
//           console.warn(
//             "No outputs found. Make sure you are passing entrypoints to ESBuild."
//           );
//           return;
//         }
//
//         /** @type Map<string, string> */
//         const manifest = new Map();
//
//         // Let's loop through all the various outputs
//         // I feel like this may not be needed with AssetMapper shipping its own file manifest creator.
//         for (const fileName in result.metafile.outputs) {
//           const output = result.metafile.outputs[fileName];
//           console.log(output)
//         }
//       })
//     }
//   }
// }
