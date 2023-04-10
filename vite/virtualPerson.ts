import type { Plugin } from "vite";
import type { PersonMeta, Person } from "../src/logic/data";
import YAML from "js-yaml";
import fs from "node:fs/promises";
import metadataParser from "markdown-yaml-metadata-parser";

export default (): Plugin => {
  const virtualModuleId = "virtual:person";
  const resolvedVirtualModuleId = "\0" + virtualModuleId;
  let inDev = false;
  return {
    name: "vite-plugin-virtual-person",

    resolveId: (id) => {
      if (id === virtualModuleId) {
        return resolvedVirtualModuleId;
      }
    },

    config: (_, env) => {
      if (env.mode === "development") inDev = true;
    },

    load: async (id) => {
      if (id === resolvedVirtualModuleId) {
        if (!inDev)
          return `export default undefined; export const page = undefined; export const info = undefined;`;
        const personTxt = await fs.readFile("./draft/info.yml", "utf-8");
        const person = YAML.load(personTxt) as PersonMeta & {
          websites: null | Record<string, string>;
        };
        const md = await fs.readFile("./draft/page.md", "utf-8");
        const { metadata } = metadataParser(md);

        const meta: PersonMeta = {
          id: person.id,
          path: "",
          name: metadata.name,
          profileUrl: "http://localhost:5173/draft/photos/profile.png",
        };

        const info: Person = {
          id: person.id,
          name: metadata.name,
          profileUrl: "http://localhost:5173/draft/photos/profile.png",
          info: [],
          websites: Object.entries(person.websites ?? []),
          comments: [],
        };
        const { info: metaInfo } = metadata;

        if (metaInfo.alias) {
          info.info.push(["昵称", metaInfo.alias]);
        }
        return `export default ${JSON.stringify(meta)};
export const info = ${JSON.stringify(info)}`;
      }
    },
  };
};
