// @ts-nocheck
export function createSimpleLogger(ns: string) {
  const prefix = `[${ns}]`;
  return {
    log(...params: unknown[]) {
      console.log(prefix, ...params);
    },

    error(...params: unknown[]) {
      console.error(prefix, ...params);
    },

    warn(...params: unknown[]) {
      console.warn(prefix, ...params);
    }

  };
}