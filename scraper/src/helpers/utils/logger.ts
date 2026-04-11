function ts(): string {
  return new Date().toISOString();
}

export function log(prefix: string, ...args: unknown[]): void {
  const parts = prefix ? [ts(), prefix, ...args] : [ts(), ...args];
  console.log(...parts);
}

export function logWarn(prefix: string, ...args: unknown[]): void {
  const parts = prefix ? [ts(), prefix, ...args] : [ts(), ...args];
  console.warn(...parts);
}

export function logError(prefix: string, ...args: unknown[]): void {
  const parts = prefix ? [ts(), prefix, ...args] : [ts(), ...args];
  console.error(...parts);
}
