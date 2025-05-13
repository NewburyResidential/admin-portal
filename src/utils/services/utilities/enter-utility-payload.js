'use server';

import axios from 'axios';
import snackbarSuccessResponse from 'src/components/response-snackbar/utility/snackbarSuccessResponse';
import snackbarCatchErrorResponse from 'src/components/response-snackbar/utility/snackbarCatchErrorResponse';
import snackbarStatusErrorResponse from 'src/components/response-snackbar/utility/snackbarStatusErrorResponse';

export async function enterUtilityPayload({
  payload,
  successTitle = 'Entrata Invoice Posted',
  errorTitle = 'Error Posting Entrata Invoice',
}) {
  const apiGatewayUrl = 'https://gpxllcrxmk.execute-api.us-east-1.amazonaws.com/enterUtilityPayload';
console.log('test')
  try {
    const response = await axios.post(apiGatewayUrl, payload);

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
