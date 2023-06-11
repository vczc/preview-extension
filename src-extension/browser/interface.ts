export type ChromiumPath = string | undefined

export interface HeadlessBrowserParams {
  arg: string[]
  headless: boolean
  executablePath: ChromiumPath
  defaultViewport: any
}

export interface ExtensionConfiguration {
  chromeExecutable?: string
  format?: 'jpeg' | 'png'
  isVerboseMode?: boolean
  startUrl?: string
  columnNumber: number
}
