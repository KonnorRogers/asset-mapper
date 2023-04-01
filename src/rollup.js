import * as path from "path"
import * as fs from "fs/promises"
import { createHash } from "crypto"

/**
 * @typedef {object} RollupAssetMapperOptions - Options for RollupAssetMapper
 * @property {string} [manifestFile] - Where to output the manifest file. Defaults to "[dir]/asset-mapper-manifest.json
 * @property {(fileContents: string) => string} [hashFile] - Function to use to hash file contents. Defaults to SHA-256.
 * @property
   {(fileName: string, options: import("rollup").NormalizedOutputOptions) => boolean}
   [shouldHash] - Function to determine whether a file should be added to the manifest.
 * @property {boolean | (options: import("rollup").NormalizedOutputOptions) => boolean}
   [skipManifest] - Function determine whether a manifest should be generated. return "false" if you dont need hashes.
 */

/**
 * @param {RollupAssetMapperOptions} pluginOptions - Options for plugin
 * @return {import("rollup").Plugin}
 */
export function RollupAssetMapper (pluginOptions = {}) {
  const defaultManifestFile = "asset-mapper-manifest.json"
  return {
    name: "RollupAssetMapper",
    // I dont think we care about the manifest for dev server.
    apply: "build",
    writeBundle: {
      sequential: true,
			order: 'post',
      async handler (options, bundle) {
        let { manifestFile } = pluginOptions


        if (pluginOptions.skipManifest === true || pluginOptions.skipManifest?.(options) === true) {
          return
        }

        const outDir = options.outDir || options.dir || path.dirname(options.file)

        if (!manifestFile) {
          manifestFile = path.join(outDir, defaultManifestFile)
          console.warn(`[RollupAssetMapper]: No {manifestFile} option specified. Outputting to: ${manifestFile}`)
        }

        ;["entryFileNames", "assetFileNames", "chunkFileNames"].forEach((str) => {
          if (options[str].includes("[hash]")) {
            console.warn(`[RollupAssetMapper]: This plugin won't be able to work correctly because {${str}} contains the [hash] keyword`)
          }
        })

        // @TODO do we need to worry about memory leaks here?
        /** @type Map<string, string> */
        const manifest = new Map()

        // console.log("BUNDLE: ", Object.keys(bundle))
        // console.log("OUTDIR: ", outDir)

        await Promise.allSettled(Object.keys(bundle).map(async (fileName) => {
          // May be too presumptuous with "manifest.json"
          if (fileName.endsWith("manifest.json")) {
            return
          }

          if (pluginOptions.shouldHash != null && pluginOptions.shouldHash(fileName, options) !== true) {
            return
          }


          const fileBuffer = await fs.readFile(path.join(outDir, fileName))

          const hash = pluginOptions.hashFile?.(fileBuffer) ?? hashFile(fileBuffer)

          const { dir, name, ext } = path.parse(fileName)
          const hashedFileName = path.join(dir, name + "-" + hash + ext)

          manifest.set(fileName, hashedFileName)

          const fullFileName = path.join(outDir, fileName)
          const fullHashedPath = path.join(outDir, hashedFileName)

          // When using SvelteKit, they expect the original file to be laying around, so lets just copy instead
          // of rename
          await fs.copyFile(fullFileName, fullHashedPath)
        }))

        const json = JSON.stringify({ assets: Object.fromEntries(manifest)}, null, 2)
        await fs.writeFile(manifestFile, json, { encoding: "utf8" })
        console.info(`[RollupAssetMapper]: Successfully wrote to ${manifestFile}`)
      }
    }
  }
}


/**
 * @param {Buffer} buffer
 * @return {string} - Returns the first 16 characters of a sha256 hash.
 */
function hashFile (buffer) {
  return createHash('sha256').update(buffer).digest("hex").substring(0, 16);
}
