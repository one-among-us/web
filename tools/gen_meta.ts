import url from "url";
import path from "path";
import fs from "fs-extra";

const dist = "dist"
const html = fs.readFileSync(path.join(dist, "index.html")).toString()


interface Meta {
  title: string
  desc: string
  image?: string
  url?: string
}
