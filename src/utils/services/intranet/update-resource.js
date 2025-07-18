'use server';

import { revalidateTag } from 'next/cache';
import { dynamoUpdateItemAttributes } from '../sdk-config/aws/dynamo-db';
import * as Sentry from '@sentry/nextjs';

import snackbarSuccessResponse from 'src/components/response-snackbar/utility/snackbarSuccessResponse';
import snackbarCatchErrorResponse from 'src/components/response-snackbar/utility/snackbarCatchErrorResponse';
import snackbarStatusErrorResponse from 'src/components/response-snackbar/utility/snackbarStatusErrorResponse';

export default async function updateResource({ pk, attributes }) {
  Sentry.setTag('functionName', 'updateResources');
  Sentry.addBreadcrumb({
    category: 'data',
    message: 'Data passed to updateResources',
    level: 'info',
    data: { pk, attributes },
  });

  const successTitle = 'Resource updated successfully';
  const errorTitle = 'Error updating Resource';

  try {
    const response = await dynamoUpdateItemAttributes({ tableName: 'admin_portal_intranet', pk, attributes });
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
