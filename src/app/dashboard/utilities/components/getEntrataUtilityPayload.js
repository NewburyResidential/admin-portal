import Big from 'big.js';
import { getPostMonth, getTodaysDate } from 'src/utils/format-time';

export async function getEntrataUtilityPayload(entries, utilities) {
  console.log('Entries:', entries);

  const cleanAmount = (amount) => {
    if (!amount) return '0';
    return amount.toString().replace(/[^0-9.-]/g, '');
  };

  const isZeroAmount = (amount) => {
    if (!amount) return true;
    return ['0', '0.00'].includes(amount) || Big(cleanAmount(amount)).eq(0);
  };

  const calculateAmount = (amount) => {
    if (!amount) return new Big(0);

    if (Array.isArray(amount)) {
      return amount.reduce((sum, item) => {
        return sum.plus(new Big(cleanAmount(item.amount)));
      }, new Big(0));
    }

    return new Big(cleanAmount(amount));
  };

  const createApDetail = (entry, amount, type) => {
    const isCommon = entry.apartment?.toLowerCase() === 'common';
    const glAccountMap = {
      electric: isCommon ? '222242' : '222243',
      gas: '222246',
      waterSewer: isCommon ? '222244' : '222245',
    };

    const typeLabels = {
      electric: 'Electric',
      gas: 'Gas',
      waterSewer: 'Water/Sewer',
    };

    return {
      propertyId: entry.accountId,
      glAccountId: glAccountMap[type],
      description: `${typeLabels[type]} ${entry.accountNumber} - ${isCommon ? 'Common' : 'APT'} ${isCommon ? entry.completeAddress : entry.apartment}`,
      rate: cleanAmount(amount),
      // invoicePayment: {
      //   invoicePaymentId: 123456789, // Use a smaller number
      //   paymentAmount: entry.totalAmount,
      // },
    };
  };

  const utilityVendor = entries[0]?.utilityVendor;
  const paymentId = entries[0]?.paymentId;
  const utilityVendorInfo = utilities.find((util) => util.pk === utilityVendor);

  if (!utilityVendorInfo) {
    throw new Error(`Utility vendor ${utilityVendor} not found`);
  }

  const allApDetails = [];
  let total = new Big(0);
  let totalTax = new Big(0);
  let totalMisc = new Big(0);

  // Process entries
  entries.forEach((entry) => {
    try {
      // Process utility amounts
      const utilityTypes = [
        { type: 'electric', amount: entry.electricAmount },
        { type: 'gas', amount: entry.gasAmount },
        { type: 'waterSewer', amount: entry.waterSewerAmount },
      ];

      utilityTypes.forEach(({ type, amount }) => {
        if (amount && !isZeroAmount(amount)) {
          allApDetails.push(createApDetail(entry, amount, type));
          total = total.plus(calculateAmount(amount));
        }
      });

      // Process tax and misc amounts
      if (entry.taxAmount) {
        totalTax = totalTax.plus(calculateAmount(entry.taxAmount));
        total = total.plus(calculateAmount(entry.taxAmount));
      }

      if (entry.miscAmount) {
        const miscAmount = calculateAmount(entry.miscAmount);
        totalMisc = totalMisc.plus(miscAmount);
        total = total.plus(miscAmount);
      }
    } catch (error) {
      console.error('Error processing amounts for entry:', entry, error);
    }
  });

  if (total.eq(0) || allApDetails.length === 0) return null;

  const sourceFiles = entries
    .filter((entry) => entry?.sourceFile)
    .map((entry) => ({
      bucket: entry.sourceFile.bucket,
      key: entry.sourceFile.key,
    }));

  const combinedNote = entries.map((entry) => entry.accountNumber).join(', ');
  const today = getTodaysDate();
  const postMonth = getPostMonth();

  return {
    payload: {
      auth: { type: 'apikey' },
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
                apPayeeId: utilityVendorInfo.apPayeeId,
                apPayeeLocationId: utilityVendorInfo.apPayeeLocationId,
                invoiceNumber: `UTILITY - ${utilityVendor} - ${paymentId}`,
                invoiceDate: today,
                dueDate: today,
                invoiceTotal: total.toString(),
                salesTax: totalTax.eq(0) ? null : totalTax.toString(),
                shipping: totalMisc.eq(0) ? null : totalMisc.toString(),
                isConsolidated: '0',
                isOnHold: '0',
                note: combinedNote,
                apDetails: {
                  apDetail: allApDetails,
                },
              },
            },
            // invoicePayments: {
            //   invoicePayment: {
            //     invoicePaymentId: 123456789, // Use a smaller number
            //     paymentTypeId: 1,
            //     paymentNumber: `API Payment - ${today}`,
            //     paymentDate: today,
            //     postMonth: postMonth,
            //     paymentMemo: `Utility Payment`,
            //   },
            // },
          },
        },
      },
    },
    sourceFiles,
  };
}
