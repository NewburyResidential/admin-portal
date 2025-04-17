import Big from 'big.js';

export function getEntrataWithdrawalPayload(entries, normalDate, fileName) {
  // Sort entries by propertyID
  const sortedEntries = [...entries].sort((a, b) => a.propertyId - b.propertyId);

  const validEntries = sortedEntries.filter((entry) => {
    try {
      const amount = new Big(entry.rate);
      return !amount.eq(0);
    } catch (e) {
      return false;
    }
  });

  // Return null if no valid entries
  if (validEntries.length === 0) {
    return null;
  }

  const total = validEntries.reduce((sum, entry) => sum.plus(new Big(entry.rate)), new Big(0));

  // Return null if total is 0
  if (total.eq(0)) {
    return null;
  }

  const postData = {
    auth: {
      type: 'apikey',
    },
    requestId: '15',
    method: {
      name: 'sendInvoices',
      version: 'r2',
      params: {
        apBatch: {
          isPaused: '0',
          isPosted: '1',
          apHeaders: {
            apHeader: {
              apPayeeId: 63387,
              apPayeeLocationId: 33970,
              invoiceNumber: `Payroll Withdrawal - ${normalDate} - ${fileName}`,
              invoiceDate: normalDate,
              dueDate: normalDate,
              invoiceTotal: total.toString(),
              isOnHold: '0',
              apDetails: {
                apDetail: validEntries,
              },
            },
          },
        },
      },
    },
  };
  return postData;
}
