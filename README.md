# Purpose

To reduce cache churn by generating stable file names, manually hashing them, and
providing a manifest by which to read the hashed assets. This is generally intended
for importmaps, but could have other applications as well.

For more info checkout this issue: <https://github.com/sveltejs/kit/issues/4482>

And this reading: <https://philipwalton.com/articles/cascading-cache-invalidation/>

## Installation

```bash
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
    RollupAssetMapper()
  ],
}
```

## Checkout SvelteKit

```bash
npx degit https://github.com/konnorrogers/asset-mapper/tests/fixtures/svelte svelte-kit
cd svelte-kit
pnpm install
pnpm run build
```

Then go to: `.svelte-kit/output/client/asset-mapper-manifest.json` to see the built assets.

## Going 1 step further

While this doesn't quite solve the "cache-invalidation" issue, its a step in the right direction.

The next step is to use the generated manifest to construct your own "importmap"

Example:

```html
<html>
  <head>
    <script type="importmap">
      {
        "imports": {{ fs.readFileSync("asset-mapper-manifest.json") }}
      }
    </script>
  </head>
  <body></body>
</html>
```

## Why is the "asset-mapper-manifest" not a flat file?

The basic reason is you may want to add additional metadata. By stuffing everything into the "assets" key
it allows the manifest to be more easily extending. If you think there's no need to
keep this open, feel free to file an issue and happy to discuss.
