'use server';

import axios from 'axios';
import snackbarSuccessResponse from 'src/components/response-snackbar/utility/snackbarSuccessResponse';
import snackbarCatchErrorResponse from 'src/components/response-snackbar/utility/snackbarCatchErrorResponse';
import snackbarStatusErrorResponse from 'src/components/response-snackbar/utility/snackbarStatusErrorResponse';

export async function postEntrataInvoice({
  payload,
  successTitle = 'Entrata Invoice Posted',
  errorTitle = 'Error Posting Entrata Invoice',
}) {
  const entrataBaseUrl = 'https://newburyresidential.entrata.com/api/v1/vendors';
  const username = process.env.ENTRATA_USERNAME;
  const password = process.env.ENTRATA_PASSWORD;

  try {
    const response = await axios.post(entrataBaseUrl, payload, {
      auth: {
        username,
        password,
      },
    });

    const entrataResponse = response?.data;
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
