import fs from "fs-extra";

declare global {
  interface String {
    read_file(): string;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    json(): any
  }
}

String.prototype.read_file = function () {
  return fs.readFileSync(this).toString();
}

String.prototype.json = function () {
  return JSON.parse(this)
}

export {}
