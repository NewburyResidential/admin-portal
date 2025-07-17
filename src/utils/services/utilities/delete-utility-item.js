"use server";

import { dynamoDeleteItem } from "../sdk-config/aws/dynamo-db";
import * as Sentry from '@sentry/nextjs';
import snackbarSuccessResponse from 'src/components/response-snackbar/utility/snackbarSuccessResponse';
import snackbarCatchErrorResponse from 'src/components/response-snackbar/utility/snackbarCatchErrorResponse';
import snackbarStatusErrorResponse from 'src/components/response-snackbar/utility/snackbarStatusErrorResponse';

export async function deleteUtilityItem(pk, sk) {
  Sentry.setTag('functionName', 'deleteUtilityItem');
  Sentry.addBreadcrumb({
    category: 'data',
    message: 'Data passed to deleteUtilityItem',
    level: 'info',
    data: { pk, sk },
  });

  const successTitle = 'Utility Item Deleted';
  const errorTitle = 'Error Deleting Utility Item';

  try {
    const response = await dynamoDeleteItem({
      tableName: 'admin_portal_utility_bills_ai_analyzer',
      pk,
      sk,
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