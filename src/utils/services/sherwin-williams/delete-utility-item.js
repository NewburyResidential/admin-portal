"use server";

import { dynamoDeleteItem } from "../sdk-config/aws/dynamo-db";
import * as Sentry from '@sentry/nextjs';
import snackbarSuccessResponse from 'src/components/response-snackbar/utility/snackbarSuccessResponse';
import snackbarCatchErrorResponse from 'src/components/response-snackbar/utility/snackbarCatchErrorResponse';
import snackbarStatusErrorResponse from 'src/components/response-snackbar/utility/snackbarStatusErrorResponse';

export async function deleteSherwinWilliamsInvoice(pk) {
  Sentry.setTag('functionName', 'deleteSherwinWilliamsInvoice');
  Sentry.addBreadcrumb({
    category: 'data',
    message: 'Data passed to deleteSherwinWilliamsInvoice',
    level: 'info',
    data: { pk },
  });

  const successTitle = 'Invoice Deleted';
  const errorTitle = 'Error Deleting Invoice';

  try {
    const response = await dynamoDeleteItem({
      tableName: 'admin_portal_sherwin_williams_invoices',
      pk,
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