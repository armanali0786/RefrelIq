const isDev = import.meta.env.DEV

export const logger = {
  log:  (...args: unknown[]) => isDev && console.log('[JobLens]', ...args),
  warn: (...args: unknown[]) => isDev && console.warn('[JobLens]', ...args),
  error:(...args: unknown[]) => console.error('[JobLens]', ...args),
}
