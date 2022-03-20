import { Plugin } from "vite";

import * as marked from "marked";

export default function vitePluginMarkdown(): Plugin {
  return {
    name: "vite-plugin-markdown",
    transform(code, id) {
      if (!id.endsWith(".md")) return;

      const html = marked.marked(code);
      return `export default ${JSON.stringify(html)}`;
    }
  }
}
