/// <reference types="vitest" />
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // ...
    include: ["tests/**/*.test.js"],
    silent: !["1", "y", "true"].includes(process.env.VERBOSE),
  },
});
