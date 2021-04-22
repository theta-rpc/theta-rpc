export function generateRandomBytes(n: number) {
  const str = Math.floor(Math.random() * Math.pow(16, n)).toString(16);
  return "0".repeat(6 - str.length) + str;
}

export function getSymbolDescr(symbol: Symbol): string {
  return symbol.toString().slice(7, -1);
}
