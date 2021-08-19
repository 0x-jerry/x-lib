// @ts-nocheck
export function tplStrings(strings: TemplateStringsArray, ...args: unknown[]): string {
  let result = strings[0];

  for (let idx = 0; idx < args.length; idx++) {
    result += args[idx] + strings[idx + 1];
  }

  return result;
}