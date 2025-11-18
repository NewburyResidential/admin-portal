import Big from 'big.js';

export default function parseCurrency(value) {
  // Handle null, undefined, or empty values
  if (value === null || value === undefined || value === '') {
    return Big(0);
  }

  if (typeof value === 'string') {
    value = value
      .replace('$', '')
      .replace(/,/g, '') // Remove all commas (not just the first one)
      .replace(/\(([^)]+)\)/, '-$1')
      .trim();
  }

  // If the string is empty after cleaning, return 0
  if (value === '' || value === '-') {
    return Big(0);
  }

  // Try to parse as a number first to validate
  const number = Number.parseFloat(value);
  const isNumber = !Number.isNaN(number) && Number.isFinite(number);

  if (!isNumber) {
    return Big(0);
  }

  // Convert to string to ensure Big.js gets a valid numeric string
  return new Big(number.toString());
}
