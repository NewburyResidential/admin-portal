import Big from 'big.js';
import { entrataGlConversion } from '../account-options';

export function getEntrataWithdrawalPayload(entries, normalDate, fileName) {
  const validEntries = entries.flatMap((entry) => {
    // Create an array of objects for each breakout GL account
    return Object.entries(entry.breakout).map(([glAccountId, amount]) => ({
      propertyId: entry.propertyId,
      glAccountId: entrataGlConversion[glAccountId],
      description: `Trakpay - ${entry.asset.label}`,
      rate: amount,
    }));
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
          isPosted: '0',
          apHeaders: {
            apHeader: {
              apPayeeId: 63387,
              apPayeeLocationId: 33970,
              invoiceNumber: `Trakpay Withdrawal - ${normalDate} - ${fileName}`,
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
