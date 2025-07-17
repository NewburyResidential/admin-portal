"use server";

import { dynamoUpdateItemAttributes } from "../sdk-config/aws/dynamo-db";
import * as Sentry from '@sentry/nextjs';
import snackbarSuccessResponse from 'src/components/response-snackbar/utility/snackbarSuccessResponse';
import snackbarCatchErrorResponse from 'src/components/response-snackbar/utility/snackbarCatchErrorResponse';
import snackbarStatusErrorResponse from 'src/components/response-snackbar/utility/snackbarStatusErrorResponse';

export async function updateUtilityItem(pk, sk, attributes) {
  Sentry.setTag('functionName', 'updateUtilityItem');
  Sentry.addBreadcrumb({
    category: 'data',
    message: 'Data passed to updateUtilityItem',
    level: 'info',
    data: { pk, sk, attributes },
  });

  const successTitle = 'Utility Item Updated';
  const errorTitle = 'Error Updating Utility Item';

  try {
    const response = await dynamoUpdateItemAttributes({
      tableName: 'admin_portal_utility_bills_ai_analyzer',
      pk,
      sk,
      attributes,
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
