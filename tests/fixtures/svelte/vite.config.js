import { sveltekit } from "@sveltejs/kit/vite";
import { RollupAssetMapper } from "../../../src/rollup.js";
import { defineConfig } from "vite";

/** @type {import("vite").UserConfig} */
export default defineConfig({
  plugins: [
    sveltekit(),
    RollupAssetMapper({
      skipManifest(options) {
        if (!options.dir.endsWith("client")) {
          return true;
        }

        // Only run the manifest generation on the client bundles.
        return false;
      },
    }),
  ],
});
