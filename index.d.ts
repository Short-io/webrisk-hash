export function canonicalize(url: string): string;
export function suffixPostfixExpressions(url: string): Set<string>;
export function truncatedSha256Prefix(url: string, size: number): Buffer<Uint8Array>;
export function getPrefixes(url: string, size: number = 32*8): Set<Buffer<Uint8Array>>;