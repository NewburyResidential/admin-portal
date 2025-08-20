'use server';

import { revalidatePath } from 'next/cache';
import { s3Upload } from '../sdk-config/aws/S3';
import { dynamoUpdateItemAttributes } from '../sdk-config/aws/dynamo-db';

export async function updateOnboardingRequirement(fileData, pk, sk, attributes) {
  let s3Response = null;
  let file = null;

  if (fileData) {
    file = fileData.get('file');
    const bucket = fileData.get('bucket');
    const key = `${pk}/${sk}`;

    s3Response = await s3Upload({ bucket, file, key });
    if (!s3Response) {
      return false;
    }
  }
  const s3url = s3Response ? { url: s3Response.Location, fileName: file.name } : {};

  const dynamoDbResponse = await dynamoUpdateItemAttributes({
    tableName: 'newbury_employees',
    pk,
    sk,
    attributes: {
      ...attributes,
      ...s3url,
      type: '#PREONBOARDING',
    },
  });
  revalidatePath('/onboarding/[slug]');
  if (!dynamoDbResponse) {
    return false;
  }

  return true;
}
