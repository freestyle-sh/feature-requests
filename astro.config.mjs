import { defineConfig } from "astro/config";
import deno from "freestyle-deno-astro-adapter";
import svelte from "@astrojs/svelte";
import mkcert from "vite-plugin-mkcert";

import auth from "auth-astro";

// https://astro.build/config
export default defineConfig({
  adapter: deno(),
  integrations: [svelte(), auth()],
  output: "server",
  vite: {
    ssr: {
      external: ["freestyle-sh"],
    },
    esbuild: {
      target: "esnext",
      format: "esm",
      platform: "node",
      keepNames: true,
    },
    plugins: [mkcert()],
  },
});
