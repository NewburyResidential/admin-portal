'use server';

import { ENTRATA_API, ENTRATA_API_KEY } from 'src/config-global';
import snackbarSuccessResponse from 'src/components/response-snackbar/utility/snackbarSuccessResponse';
import snackbarCatchErrorResponse from 'src/components/response-snackbar/utility/snackbarCatchErrorResponse';
import snackbarStatusErrorResponse from 'src/components/response-snackbar/utility/snackbarStatusErrorResponse';

export async function postEntrataInvoice({
  payload,
  successTitle = 'Entrata Invoice Posted',
  errorTitle = 'Error Posting Entrata Invoice',
}) {
  const endpoint = '/v1/vendors';
  const url = `${ENTRATA_API.baseUrl}${endpoint}`;

  const body = {
    auth: { type: 'apikey' },
    requestId: '15',
    method: { name: 'sendInvoices' },
    ...payload,
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'X-Api-Key': ENTRATA_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const entrataResponse = await response.json();
    console.log('entrataResponse', entrataResponse);

    const responseStatus = entrataResponse?.response?.result?.apBatch?.apHeaders?.apHeader[0]?.status;
    const expectedStatus = 'Success';

    if (responseStatus === expectedStatus) {
      return snackbarSuccessResponse(entrataResponse, successTitle);
    }
    return snackbarStatusErrorResponse(entrataResponse, responseStatus, expectedStatus, errorTitle);
  } catch (error) {
    return snackbarCatchErrorResponse(error, errorTitle);
  }
}
