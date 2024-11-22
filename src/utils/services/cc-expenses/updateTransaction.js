'use server';

import { dynamoUpdateItemAttributes } from '../sdk-config/aws/dynamo-db';
import * as Sentry from '@sentry/nextjs';

import snackbarSuccessResponse from 'src/components/response-snackbar/utility/snackbarSuccessResponse';
import snackbarCatchErrorResponse from 'src/components/response-snackbar/utility/snackbarCatchErrorResponse';
import snackbarStatusErrorResponse from 'src/components/response-snackbar/utility/snackbarStatusErrorResponse';

export default async function updateTransaction(pk, sk, attributesToUpdate) {
  Sentry.setTag('functionName', 'updateCreditCardTransaction');
  Sentry.addBreadcrumb({
    category: 'data',
    message: 'Data passed to updateTransaction',
    level: 'info',
    data: { pk, sk, attributesToUpdate },
  });

  const successTitle = 'Transaction Submitted';
  const errorTitle = 'Error Submitting transaction';

  try {
    const response = await dynamoUpdateItemAttributes({
      tableName: 'admin_portal_expenses',
      pk,
      sk,
      attributes: attributesToUpdate,
    });
    const responseStatus = response?.$metadata.httpStatusCode;
    const expectedStatus = 200;
    if (responseStatus === expectedStatus) {
      return snackbarSuccessResponse(response, successTitle);
    }
    return snackbarStatusErrorResponse(response, responseStatus, expectedStatus, errorTitle);
  } catch (error) {
    return snackbarCatchErrorResponse(error, errorTitle);
  }
}
