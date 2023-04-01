# Purpose

To reduce cache churn by generating stable file names, manually hashing them, and
providing a manifest by which to read the hashed assets. This is generally intended
for importmaps, but could have other applications as well.

For more info checkout this issue: <https://github.com/sveltejs/kit/issues/4482>


## Installation

```console
npm install asset-mapper

# OR

yarn install asset-mapper

# OR

pnpm install asset-mapper
```

## Vite Usage

```js
// vite.config.js
import { RollupAssetMapper } from "asset-mapper"

export default {
  build: {
    rollupOptions: {
      input: {
        // ...
      },
      output: {
        entryFileNames: `[name].js`,
        chunkFileNames: `chunks/[name].js`,
        assetFileNames: `assets/[name].[ext]`
      }
      outdir: // ...
    },
  },
  plugins: [
    RollupAssetMapper({ manifestFile: path.join(outdir, "asset-mapper-manifest.json") })
  ],
}
```
