'use server';

import { s3Upload } from '../sdk-config/aws/S3';
import { dynamoUpdateItemAttributes } from '../sdk-config/aws/dynamo-db';

export async function updateDocument(fileData, data) {
  const file = fileData.get('file');
  const {bucket} = data;
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
      updatedOn: data.updatedOn,
      updatedBy: data.updatedBy,
    },
  });
  if (!dynamoDbResponse) {
    return false;
  }

  return true;
}


