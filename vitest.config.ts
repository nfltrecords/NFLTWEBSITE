import { fileURLToPath } from "node:url";
import { defineConfig, mergeConfig } from "vitest/config";
import viteConfig from "./vite.config";

export default mergeConfig(
  viteConfig,
  defineConfig({
    resolve: {
      alias: {
        "cloudflare:workers": fileURLToPath(
          new URL("./src/test/mocks/cloudflare-workers.ts", import.meta.url),
        ),
      },
    },
  }),
);
