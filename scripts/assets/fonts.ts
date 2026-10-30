import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)

export interface Face {
  family: string
  weight: number
  /** Package path of a static woff2 instance. */
  file: string
}

/**
 * Static (non-variable) latin instances from @fontsource. Variable fonts can come out as Type 3
 * glyph drawings in Chromium's PDF output, which parsers can't read as text.
 */
export const instrumentSans = (weight: 400 | 500 | 600): Face => ({
  family: 'Instrument Sans',
  weight,
  file: `@fontsource/instrument-sans/files/instrument-sans-latin-${weight}-normal.woff2`,
})

export const newsreader: Face = {
  family: 'Newsreader',
  weight: 400,
  file: '@fontsource/newsreader/files/newsreader-latin-400-normal.woff2',
}

/** @font-face rules with the files inlined: rendering never touches the network or system fonts. */
export function fontFaceCss(faces: Face[]): string {
  return faces
    .map(({ family, weight, file }) => {
      const data = readFileSync(require.resolve(file)).toString('base64')
      return `@font-face{font-family:"${family}";font-style:normal;font-weight:${weight};font-display:block;src:url(data:font/woff2;base64,${data}) format("woff2")}`
    })
    .join('\n')
}
