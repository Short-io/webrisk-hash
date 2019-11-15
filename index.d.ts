export function canonicalize(url: string): string;
export function suffixPostfixExpressions(url: string): Set<string>;
export function truncatedSha256Prefix(url: string, size: number): Buffer;
export function getPrefixes(url: string, size?: number): Set<Buffer>;
