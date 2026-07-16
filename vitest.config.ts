import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["packages/**/*.test.ts", "scripts/**/*.test.ts"],
    exclude: ["**/*.contract.test.ts", "**/node_modules/**", "**/dist/**"],
    globals: false,
  },
});
