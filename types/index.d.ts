declare module 'puppeteer-core'

declare module 'karma-chrome-launcher' {
  type OSMap = Record<string, string | null>
  export const example: ['type', { prototype: { DEFAULT_CMD: OSMap } }]
}
