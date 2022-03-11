import path from "path";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

import tsconfig from "./tsconfig.json";

const tsconfigPathAliases = Object.fromEntries(
  Object.entries(tsconfig.compilerOptions.paths).map(([key, values]) => {
    let value = values[0];
    if (key.endsWith("/*")) {
      key = key.slice(0, -2);
      value = value.slice(0, -2);
    }

    const nodeModulesPrefix = "node_modules/";
    if (value.startsWith(nodeModulesPrefix)) {
      value = value.replace(nodeModulesPrefix, "");
    } else {
      value = path.join(__dirname, value);
    }

    return [key, value];
  })
);

export default defineConfig({
  plugins: [
    vue()
  ],
  resolve: {
    alias: {
      ...tsconfigPathAliases,
      vue: "vue/dist/vue.esm-bundler.js"
    }
  }
});
