'use server';

import { revalidateTag } from 'next/cache';
import { dynamoUpdateItemAttributes } from '../sdk-config/aws/dynamo-db';
import * as Sentry from '@sentry/nextjs';

import snackbarSuccessResponse from 'src/components/response-snackbar/utility/snackbarSuccessResponse';
import snackbarCatchErrorResponse from 'src/components/response-snackbar/utility/snackbarCatchErrorResponse';
import snackbarStatusErrorResponse from 'src/components/response-snackbar/utility/snackbarStatusErrorResponse';

export default async function updateEmployee({ pk, attributes }) {
  Sentry.setTag('functionName', 'updateEmployee');
  Sentry.addBreadcrumb({
    category: 'data',
    message: 'Data passed to updateEmployee',
    level: 'info',
    data: { pk, attributes },
  });

  const successTitle = 'Employee updated successfully';
  const errorTitle = 'Error updating employee';

  try {
    const response = await dynamoUpdateItemAttributes({ tableName: 'newbury_employees', sk: '#EMPLOYEE', pk, attributes });
    const responseStatus = response?.$metadata.httpStatusCode;
    const expectedStatus = 200;
    if (responseStatus === expectedStatus) {
      revalidateTag('employees');
      return snackbarSuccessResponse(response, successTitle);
    }
    return snackbarStatusErrorResponse(response, responseStatus, expectedStatus, errorTitle);
  } catch (error) {
    return snackbarCatchErrorResponse(error, errorTitle);
  }
}
