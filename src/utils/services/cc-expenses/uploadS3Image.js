'use server';

import { Upload } from '@aws-sdk/lib-storage';
import { S3Client, CopyObjectCommand } from '@aws-sdk/client-s3';

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

  // Add size logging
  const fileSizeInBytes = file.size;
  const fileSizeInMB = fileSizeInBytes / (1024 * 1024);
  console.log(`File size: ${fileSizeInMB.toFixed(2)} MB`);

  const fileExtension = file.name.substring(file.name.lastIndexOf('.'));
  const id = formData.get('name');
  const filename = `${id}${fileExtension}`;

  const key = `receipts/${filename}`;
  const isPdf = file.name.toLowerCase().endsWith('.pdf');

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
    const fileUrl = `https://${Bucket}.s3.amazonaws.com/receipts/${encodeURIComponent(`${id}${fileExtension}`)}`;
    const pdfUrl = `https://${Bucket}.s3.amazonaws.com/temp-pdfs/${encodeURIComponent(`${id}.pdf`)}`;
    const tempPdfUrl = isPdf ? fileUrl : pdfUrl;
    return { fileUrl, tempPdfUrl };
  } catch (error) {
    console.error('Error uploading image:', error);
    throw new Error('Error uploading image');
  }
}

export async function copyS3Object({ sourceBucket, destinationBucket, objectKey, id, fileExtension }) {
  const copySource = encodeURIComponent(`${sourceBucket}/${objectKey}`);

  const isPdf = fileExtension === 'pdf';
  const key = `receipts/${id}.${fileExtension}`;

  const params = {
    CopySource: copySource,
    Bucket: destinationBucket,
    Key: key,
  };

  try {
    await s3Client.send(new CopyObjectCommand(params));
    const fileUrl = `https://${destinationBucket}.s3.amazonaws.com/receipts/${encodeURIComponent(`${id}.${fileExtension}`)}`;
    const pdfUrl = `https://${destinationBucket}.s3.amazonaws.com/temp-pdfs/${encodeURIComponent(`${id}.pdf`)}`;
    const tempPdfUrl = isPdf ? fileUrl : pdfUrl;
    console.log('fileUrl', fileUrl);
    console.log('tempPdfUrl', tempPdfUrl);
    return { fileUrl, tempPdfUrl };
  } catch (err) {
    console.log('Error', err);
    throw new Error('Error uploading image');
  }
}
