'use server';

import { Upload } from '@aws-sdk/lib-storage';
import { S3Client, CopyObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';

const s3Client = new S3Client({
  region: 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export async function uploadS3Image(formData) {
  const Bucket = formData.get('bucket');
  const file = formData.get('file');
  const fileName = file.name;

  const key = uuidv4();

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
    const fileUrl = `https://${Bucket}.s3.amazonaws.com/${encodeURIComponent(`${key}`)}`;
    return { fileUrl, fileName };
  } catch (error) {
    console.error('Error uploading image:', error);
    return null;
  }
}
