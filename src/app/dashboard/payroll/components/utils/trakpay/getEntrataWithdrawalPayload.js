import Big from 'big.js';
import { entrataGlConversion } from '../account-options';
import { getPostMonth } from 'src/utils/format-time';
import { v4 as uuidv4 } from 'uuid';

export function getEntrataWithdrawalPayload(entries, normalDate, fileName) {
  const validEntries = entries.flatMap((entry) => {
    // Create an array of objects for each breakout GL account
    return Object.entries(entry.breakout).map(([glAccountId, amount]) => ({
      propertyId: entry.propertyId,
      glAccountId: entrataGlConversion[glAccountId],
      description: `Trakpay - ${entry.asset.label}`,
      rate: amount,
      invoicePayment: {
        invoicePaymentId: 123456789, //random number
        paymentAmount: amount,
      },
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

  const postMonth = getPostMonth(normalDate);
  console.log('postMonth', postMonth);

  // Generate unique payment number from UUID (numbers only)
  const uniquePaymentNumber = parseInt(uuidv4().replace(/-/g, '').replace(/[a-f]/gi, ''), 10);

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
          invoicePayments: {
            invoicePayment: {
              invoicePaymentId: 123456789,
              paymentTypeId: 1,
              paymentNumber: `API Payment - ${normalDate}`,
              paymentDate: normalDate,
              postMonth: postMonth,
              paymentMemo: `Trakpay Withdrawal Payment - ${fileName}`,
            },
          },
        },
      },
    },
  };
  return postData;
}
