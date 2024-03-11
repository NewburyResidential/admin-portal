"use server";
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { S3Client } from '@aws-sdk/client-s3';

const s3Client = new S3Client({
  region: 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export default async function getSignedS3Url(bucketName, objectKey) {
  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: objectKey,
  });

  const expires = 60 * 60;

  try {
    const url = await getSignedUrl(s3Client, command, { expiresIn: expires });
    return url;
  } catch (error) {
    console.error('Error generating pre-signed URL', error);
    throw error;
  }
}
