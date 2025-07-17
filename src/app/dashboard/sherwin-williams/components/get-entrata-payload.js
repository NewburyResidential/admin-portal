import { getTodaysDate } from 'src/utils/format-time';
import { v4 as uuidv4 } from 'uuid';

export default function getEntrataPayload(apDetails, notes, totalAmount) {
  const today = getTodaysDate();

  const payload = {
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
          isPosted: '0', // change to 1 when ready to post
          apHeaders: {
            apHeader: {
              apPayeeId: '63395',
              apPayeeLocationId: '52665',
              invoiceNumber: `SHERWIN WILLIAMS - ${uuidv4()}`,
              invoiceDate: today,
              dueDate: today,
              invoiceTotal: totalAmount,
              note: notes,
              isOnHold: '0',
              isConsolidated: '0',
              apDetails: {
                apDetail: apDetails,
              },
            },
          },
        },
      },
    },
  };
  return payload;
}
