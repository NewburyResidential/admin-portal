'use server';

import { Upload } from '@aws-sdk/lib-storage';
import { S3Client } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';

const s3Client = new S3Client({
  region: 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export async function uploadS3Utility(formData) {
  const file = formData.get('file');
  const skPrefix = formData.get('skPrefix');

  const Bucket = 'admin-portal-utility-bills';
  const key = uuidv4();

  const upload = new Upload({
    client: s3Client,
    params: {
      Bucket,
      Key: key,
      Body: file.stream(),
      ContentDisposition: 'inline',
      ContentType: file.type,
      Metadata: {
        'x-amz-meta-sk-prefix': skPrefix,
      },
    },
  });

  try {
    const response = await upload.done();
    if (response.$metadata.httpStatusCode === 200) return true;
    else return false;
  } catch (error) {
    console.error('Error uploading image:', error);
    return false;
  }
}
