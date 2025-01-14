'use server';

import axios from 'axios';
import snackbarSuccessResponse from 'src/components/response-snackbar/utility/snackbarSuccessResponse';
import snackbarCatchErrorResponse from 'src/components/response-snackbar/utility/snackbarCatchErrorResponse';
import snackbarStatusErrorResponse from 'src/components/response-snackbar/utility/snackbarStatusErrorResponse';

export async function postWaveTransaction({
  payload,
  successTitle = 'Wave Transaction Sent',
  errorTitle = 'Error Sending Wave Transaction',
}) {
  const waveBaseUrl = 'https://gql.waveapps.com/graphql/public';
  const bearerToken = process.env.WAVE_BEARER_TOKEN;

  try {
    const response = await axios.post(waveBaseUrl, payload, {
      headers: {
        Authorization: `Bearer ${bearerToken}`,
      },
    });

    const waveResponse = response?.data;

    const responseStatus = waveResponse?.data?.moneyTransactionCreate?.didSucceed;
    const expectedStatus = true;

    if (responseStatus === expectedStatus) {
      return snackbarSuccessResponse(waveResponse, successTitle);
    }
    return snackbarStatusErrorResponse(waveResponse, responseStatus, expectedStatus, errorTitle);
  } catch (error) {
    return snackbarCatchErrorResponse(error, errorTitle);
  }
}
