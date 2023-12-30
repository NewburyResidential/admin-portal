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

// TO DO: review
export function isIncorrectAmounts(transaction) {
  if (!Array.isArray(transaction.allocations)) {
    return true;
  }

  const totalAllocations = transaction.allocations.reduce((acc, allocation, index) => {
    const amount = Number(allocation.amount);
    if (isMissingValue(amount)) {
      throw new Error('Missing value');
    }

    if (index === 0) {
      acc.firstAmountSign = Math.sign(amount);
    } else if (Math.sign(amount) !== acc.firstAmountSign) {
      throw new Error('Inconsistent sign');
    }

    return { total: acc.total + amount, firstAmountSign: acc.firstAmountSign };
  }, { total: 0, firstAmountSign: null });

  try {
    return totalAllocations.total !== Number(transaction.amount);
  } catch (error) {
    return true;
  }
}

