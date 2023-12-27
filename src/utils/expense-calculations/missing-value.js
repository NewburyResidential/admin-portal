export function isMissingValue(value) {
  if (value === null || value === undefined) {
    return true;
  }

  if (typeof value === 'string') {
    return value.trim() === '';
  }

  if (typeof value === 'object' && !Array.isArray(value)) {
    return Object.keys(value).length === 0;
  }

  if (Array.isArray(value)) {
    return value.length === 0;
  }

  if (typeof value === 'number') {
    return value === 0 || Number.isNaN(value);
  }

  return false;
}

export function isIncorrectAmounts(transaction) {
  if (!Array.isArray(transaction.allocations)) {
    return true;
  }

  let totalAllocations = 0;
  let firstAmountSign = null;
  for (const allocation of transaction.allocations) {
    const amount = Number(allocation.amount);
    if (isMissingValue(amount)) {
      return true;
    }

    if (firstAmountSign === null) {
      firstAmountSign = Math.sign(amount);
    } else if (Math.sign(amount) !== firstAmountSign) {
      return true;
    }

    totalAllocations += amount;
  }

  return totalAllocations !== Number(transaction.amount);
}
