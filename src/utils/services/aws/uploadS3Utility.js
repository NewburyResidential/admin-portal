'use server';

import { Upload } from '@aws-sdk/lib-storage';
import { S3Client } from '@aws-sdk/client-s3';

const s3Client = new S3Client({
  region: 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export async function uploadS3Utility(formData) {
  const Bucket = 'admin-portal-utility-bills';
  const file = formData.get('file');
  const filename = `test`;
  const key = `random-${Math.random()}-${filename}`;

  const upload = new Upload({
    client: s3Client,
    params: {
      Bucket,
      Key: key,
      Body: file.stream(),
      ContentDisposition: 'inline',
      ContentType: file.type,
    },
  });

  try {
    await upload.done();
    return {
      key,
      filename,
    };
  } catch (error) {
    console.error('Error uploading image:', error);
    return null;
  }
}
