import fs from "fs-extra";
import subsetFont from 'subset-font'
import replaceInFiles from 'replace-in-files'

export async function optimize_font(file: string, characters: string, dist: string)
{
  const buf = fs.readFileSync(file)
  const exts = ['woff2', 'woff']

  // Optimize fonts
  for (const ext of exts)
  {
    console.log("> Converting to", ext)
    const nf = file.with_ext(`optimized.${ext}`)
    fs.writeFileSync(nf, await subsetFont(buf, characters, {targetFormat: ext}))

    // Replace CSS font names
    console.log('> Patched:', await replaceInFiles({
      files: dist + '/*',
      from: file.with_ext(ext).file_name(),
      to: nf.file_name()
    }))
  }

  // Delete old fonts
  fs.removeSync(file)
  for (const ext of ['woff2', 'woff'])
    fs.removeSync(file.with_ext(ext))

  // Replace CSS font names
  for (const ext of exts)
  {
    const orig = file.with_ext(ext)
    const new_ = file.with_ext(`optimized.${ext}`)


  }
}
