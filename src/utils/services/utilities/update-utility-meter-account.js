"use server";

import { dynamoUpdateItemAttributes } from "../sdk-config/aws/dynamo-db";
import { revalidateTag } from 'next/cache';
import * as Sentry from '@sentry/nextjs';
import snackbarSuccessResponse from 'src/components/response-snackbar/utility/snackbarSuccessResponse';
import snackbarCatchErrorResponse from 'src/components/response-snackbar/utility/snackbarCatchErrorResponse';
import snackbarStatusErrorResponse from 'src/components/response-snackbar/utility/snackbarStatusErrorResponse';

export async function updateUtilityMeterAccount(pk, sk, attributes) {
  Sentry.setTag('functionName', 'updateUtilityMeterAccount');
  Sentry.addBreadcrumb({
    category: 'data',
    message: 'Data passed to updateUtilityMeterAccount',
    level: 'info',
    data: { pk, sk, attributes },
  });

  const successTitle = 'Utility Meter Account Updated';
  const errorTitle = 'Error Updating Utility Meter Accounts';

  try {
    const response = await dynamoUpdateItemAttributes({
      tableName: 'utility-meter-accounts',
      pk,
      sk,
      attributes,
    });
    const responseStatus = response?.$metadata.httpStatusCode;
    const expectedStatus = 200;
    
    if (responseStatus === expectedStatus) {
      revalidateTag('utility-meter-accounts');
      return snackbarSuccessResponse(response, successTitle);
    }
    return snackbarStatusErrorResponse(response, responseStatus, expectedStatus, errorTitle);
  } catch (error) {
    return snackbarCatchErrorResponse(error, errorTitle);
  }
}
