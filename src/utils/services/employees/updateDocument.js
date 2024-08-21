'use server';

import { revalidateTag } from 'next/cache';
import { s3Delete, s3Upload } from '../sdk-config/aws/S3';
import { dynamoDeleteItem, dynamoUpdateItemAttributes } from '../sdk-config/aws/dynamo-db';
import snackbarCatchErrorResponse from 'src/components/response-snackbar/utility/snackbarCatchErrorResponse';
import snackbarStatusErrorResponse from 'src/components/response-snackbar/utility/snackbarStatusErrorResponse';
import snackbarSuccessResponse from 'src/components/response-snackbar/utility/snackbarSuccessResponse';

export async function updateDocument(fileData, data) {
  const file = fileData.get('file');
  const { bucket } = data;
  const key = `${data.employeePk}/${data.fileId}`;

  const s3Response = await s3Upload({ bucket, file, key });
  if (!s3Response) {
    return false;
  }

  const dynamoDbResponse = await dynamoUpdateItemAttributes({
    tableName: 'newbury_employees',
    pk: data.employeePk,
    sk: data.fileId,
    attributes: {
      label: data.label,
      updatedOn: data.updatedOn,
      updatedBy: data.updatedBy,
      status: '#COMPLETE',
      type: '#DOCUMENT',
      url: s3Response.Location,
      fileName: file.name,
    },
  });
  revalidateTag('employees');
  if (!dynamoDbResponse) {
    return false;
  }

  return true;
}

export async function updateDocumentLabel(data) {
  const dynamoDbResponse = await dynamoUpdateItemAttributes({
    tableName: 'newbury_employees',
    pk: data.employeePk,
    sk: data.fileId,
    attributes: {
      label: data.label,
    },
  });
  revalidateTag('employees');

  if (!dynamoDbResponse) {
    return false;
  }

  return true;
}

export async function deleteDocument({ data, successTitle, errorTitle }) {
  try {
    const s3Response = await s3Delete({
      bucket: 'newbuy-employee-documents',
      key: `${data.pk}/${data.sk}`,
    });
    const s3status = s3Response.$metadata.httpStatusCode;
    if (s3status !== 204) {
      return snackbarStatusErrorResponse(s3Response, errorTitle);
    }

    const dynamoDbresponse = await dynamoDeleteItem({
      tableName: 'newbury_employees',
      pk: data.pk,
      sk: data.sk,
    });

    const dynamoStatus = dynamoDbresponse.$metadata.httpStatusCode;
    if (dynamoStatus === 200) {
      revalidateTag('employees');
      return snackbarSuccessResponse(dynamoDbresponse, successTitle);
    }
    return snackbarStatusErrorResponse(dynamoDbresponse, errorTitle);
  } catch (error) {
    return snackbarCatchErrorResponse(error, errorTitle);
  }
}

