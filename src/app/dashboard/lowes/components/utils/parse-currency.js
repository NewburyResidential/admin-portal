import Big from 'big.js';

export default function parseCurrency(value) {
  if (typeof value === 'string') {
    value = value
      .replace('$', '')
      .replace(/\(([^)]+)\)/, '-$1')
      .trim();
  }
  const number = Number.parseFloat(value);
  const isNumber = !Number.isNaN(number) && Number.isFinite(number);
  return isNumber ? new Big(number) : Big(0);
}
