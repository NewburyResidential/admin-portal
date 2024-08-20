'use server';

import * as Sentry from '@sentry/nextjs';

import snackbarSuccessResponse from 'src/components/response-snackbar/utility/snackbarSuccessResponse';
import snackbarCatchErrorResponse from 'src/components/response-snackbar/utility/snackbarCatchErrorResponse';
import snackbarStatusErrorResponse from 'src/components/response-snackbar/utility/snackbarStatusErrorResponse';
import { dynamoScan } from '../sdk-config/aws/dynamo-db';

export default async function getResources() {
  Sentry.setTag('functionName', 'getResources');

  const successTitle = 'Get all Resources successfully';
  const errorTitle = 'Error getting all Resources';

  try {
    const response = await dynamoScan({ tableName: 'admin_portal_intranet' });
    const responseStatus = response?.$metadata.httpStatusCode;
    const expectedStatus = 200;
    if (responseStatus === expectedStatus) {
      const resources = response.Items;
      return snackbarSuccessResponse(response, successTitle, resources);
    }
    return snackbarStatusErrorResponse(response, responseStatus, expectedStatus, errorTitle);
  } catch (error) {
    return snackbarCatchErrorResponse(error, errorTitle);
  }
}
