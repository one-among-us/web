import { Plugin } from "vite";
import fs from "node:fs/promises";

import * as marked from "marked";
import metadataParser from "markdown-yaml-metadata-parser";
import autocorrect from "autocorrect-node";
import renderMdx from "./renderMdx";

export default function vitePluginMarkdown(): Plugin {
  return {
    name: "vite-plugin-markdown",
    transform: async (code, id) => {
      if (!id.endsWith(".md")) return;
      // is draft page
      if (id.includes("page.md")) {
        let markdown = metadataParser(await fs.readFile(id, "utf-8")).content;

        // Autocorrect markdown
        markdown = autocorrect.formatFor(markdown, "markdown");
        const result = await renderMdx(markdown);

        return `export default ${JSON.stringify(result)}`;
      }
      const html = marked.marked(code);
      return `export default ${JSON.stringify(html)}`;
    },
  };
}
