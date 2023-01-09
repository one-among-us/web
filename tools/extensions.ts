import fs from "fs-extra";
import path from "path";

declare global {
  interface String {
    read_file(): string;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    json(): any

    join(...s: string[]): string;

    parent(): string

    file_name(): string

    with_ext(ext: string): string
  }
}

String.prototype.read_file = function () {
  if (fs.existsSync(this)) return fs.readFileSync(this).toString();
}

String.prototype.json = function () {
  return JSON.parse(this)
}

String.prototype.join = function (...s: string[]) {
  return path.join(this, ...s)
}

String.prototype.parent = function () {
  return path.dirname(this)
}

String.prototype.file_name = function () {
  const split = this.replace("\\", "/").split("/")
  return split[split.length - 1]
}

String.prototype.with_ext = function (ext: string) {
  if (ext.startsWith(".")) ext = ext.substring(1)
  const lastDot = this.lastIndexOf(".")
  return this.substring(0, lastDot + 1) + ext
}

export {}
