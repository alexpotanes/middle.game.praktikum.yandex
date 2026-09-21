declare module 'cookie-parser' {
  import type { RequestHandler } from 'express'

  function cookieParser(
    secret?: string | string[],
    options?: unknown
  ): RequestHandler

  export = cookieParser
}

declare module 'serialize-javascript' {
  type SerializeOptions = {
    isJSON?: boolean
  }

  function serialize(value: unknown, options?: SerializeOptions): string

  export default serialize
}
