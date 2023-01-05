import fs from "fs-extra";

declare global {
  interface String {
    read_file(): string;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fetch_json(): any
  }
}

String.prototype.read_file = function () {
  return fs.readFileSync(this).toString();
}

String.prototype.fetch_json = async function () {
  return await (await fetch(this)).json()
}

export {}
