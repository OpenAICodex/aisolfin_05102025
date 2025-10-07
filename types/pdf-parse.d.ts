declare module 'pdf-parse' {
  export interface PDFParseOptions {
    pagerender?: (page: unknown) => Promise<string> | string;
    max?: number;
    version?: string;
  }

  export interface PDFParseResult {
    numpages: number;
    numrender: number;
    info?: Record<string, unknown> | null;
    metadata?: unknown;
    text: string;
    version?: string;
  }

  export function parse(
    data: ArrayBuffer | Buffer | Uint8Array,
    options?: PDFParseOptions
  ): Promise<PDFParseResult>;

  const defaultExport: typeof parse;
  export default defaultExport;
}
