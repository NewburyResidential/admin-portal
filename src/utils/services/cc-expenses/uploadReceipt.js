'use server';

import { dynamoAdd } from '../sdk-config/aws/dynamo-db';
import { s3Upload } from '../sdk-config/aws/S3';
import * as Sentry from '@sentry/nextjs';

import snackbarSuccessResponse from 'src/components/response-snackbar/utility/snackbarSuccessResponse';
import snackbarCatchErrorResponse from 'src/components/response-snackbar/utility/snackbarCatchErrorResponse';
import snackbarStatusErrorResponse from 'src/components/response-snackbar/utility/snackbarStatusErrorResponse';

export default async function uploadReceipt(formData) {
  // Set up Sentry tracking
  Sentry.setTag('functionName', 'uploadReceipt');
  Sentry.addBreadcrumb({
    category: 'data',
    message: 'Data passed to uploadReceipt',
    level: 'info',
    data: { formData },
  });

  const mainErrorTitle = 'Error Uploading Receipt';

  const s3SuccessTitle = 'Receipt Uploaded';
  const s3ErrorTitle = 'Error Uploading Receipt';
  const dynamoSuccessTitle = 'Receipt Added to DynamoDB';
  const dynamoErrorTitle = 'Error Adding Receipt to DynamoDB';

  try {
    const file = formData.get('file');
    const receiptData = JSON.parse(formData.get('receiptData'));

    // Upload to S3 first
    const s3Response = await s3Upload({
      bucket: 'admin-portal-cc-suggested-receipts',
      key: receiptData.s3Key,
      file,
    });

    const s3Status = s3Response?.$metadata.httpStatusCode;
    const expectedS3Status = 200;

    // Only proceed with DynamoDB if S3 upload was successful
    if (s3Status === expectedS3Status) {
      const multipleResponses = [];
      multipleResponses.push(snackbarSuccessResponse(s3Response, s3SuccessTitle));
      const dynamoResponse = await dynamoAdd({
        tableName: 'admin_portal_cc_suggested_receipts',
        item: receiptData,
      });
      const dynamoStatus = dynamoResponse?.$metadata.httpStatusCode;
      const expectedDynamoStatus = 200;

      if (dynamoStatus === expectedDynamoStatus) {
        multipleResponses.push(snackbarSuccessResponse(dynamoResponse, dynamoSuccessTitle));
      } else {
        multipleResponses.push(snackbarStatusErrorResponse(dynamoResponse, dynamoStatus, expectedDynamoStatus, dynamoErrorTitle));
      }
      return multipleResponses;
    }

    return snackbarStatusErrorResponse(s3Response, s3Status, expectedS3Status, s3ErrorTitle);
  } catch (error) {
    return snackbarCatchErrorResponse(error, mainErrorTitle);
  }
}
