import { test } from "vitest"
// import * as path from "node:path"
// import { rollup } from "rollup"
//
//
// const fixtures = path.join(process.cwd(), "tests/fixtures/entrypoints")

/** @type {import("rollup").RollupOptions[]} */
// const options = {
//   input: {
//     "app": path.join(fixtures, "app.js"),
//     "app2": path.join(fixtures, "app2.js")
//   },
//   output: {
//     dir: path.join(process.cwd(), "tmp")
//   }
// }
//
test.skip("Should work with rollup", async () => {
  const bundle = await rollup(options)
  bundle.write()
})
