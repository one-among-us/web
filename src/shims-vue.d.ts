/// <reference types="vite/client" />

/* eslint-disable */

declare module "*.vue" {
  import type { DefineComponent } from "vue";
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

declare module "*.md" {
  const html: string;
  export default html;
}

declare module "virtual:person" {
  import { PersonMeta, Person } from "./logic/data";
  const person: PersonMeta;
  export const info: Person;
  export default person;
}

declare module "markdown-yaml-metadata-parser" {
  const metadataParser: <T>(source: string) => { content: string; metadata: T };
  export default metadataParser;
}
