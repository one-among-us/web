import { Plugin } from "vite";

import { marked } from "marked";

const markedOptions = { async: false } as const;

export default function vitePluginMarkdown(): Plugin {
  return {
    name: "vite-plugin-markdown",
    transform(code, id) {
      if (!id.endsWith(".md")) return;

      const html = marked(code, markedOptions);
      return `export default ${JSON.stringify(html)}`;
    }
  }
}
