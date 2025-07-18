'use server';

import { revalidateTag } from 'next/cache';
import { dynamoDeleteItem } from '../sdk-config/aws/dynamo-db';
import * as Sentry from '@sentry/nextjs';

import snackbarSuccessResponse from 'src/components/response-snackbar/utility/snackbarSuccessResponse';
import snackbarCatchErrorResponse from 'src/components/response-snackbar/utility/snackbarCatchErrorResponse';
import snackbarStatusErrorResponse from 'src/components/response-snackbar/utility/snackbarStatusErrorResponse';

export default async function deleteResource({ pk }) {
  Sentry.setTag('functionName', 'deleteResource');
  Sentry.addBreadcrumb({
    category: 'data',
    message: 'Data passed to deleteResource',
    level: 'info',
    data: pk,
  });

  const successTitle = 'Resource deleted successfully';
  const errorTitle = 'Error deleted Resource';

  try {
    const response = await dynamoDeleteItem({ tableName: 'admin_portal_intranet', pk });
    const responseStatus = response?.$metadata.httpStatusCode;
    const expectedStatus = 200;
    if (responseStatus === expectedStatus) {
      revalidateTag('intranet-resources');
      return snackbarSuccessResponse(response, successTitle);
    }
    return snackbarStatusErrorResponse(response, responseStatus, expectedStatus, errorTitle);
  } catch (error) {
    return snackbarCatchErrorResponse(error, errorTitle);
  }
}
