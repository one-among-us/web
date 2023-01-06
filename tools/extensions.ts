import fs from "fs-extra";
import path from "path";

declare global {
  interface String {
    read_file(): string;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    json(): any

    join(...s: string[]): string;

    parent(): string
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

export {}
