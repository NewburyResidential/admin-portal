'use server';

import { Upload } from '@aws-sdk/lib-storage';
import { S3Client, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { AWS_CONFIG } from 'src/config-global';

const s3Client = new S3Client(AWS_CONFIG);

// UPDATE OR ADD OBJECT TO S3

// bucket: bucket name
// key: file directory
// file: file to upload
// contentDisposition: inline or attachment

export const s3Upload = async ({ bucket, key, file, contentDisposition = 'inline', metadata = {} }) => {
  const upload = new Upload({
    client: s3Client,
    params: {
      Bucket: bucket,
      Key: key,
      Body: file.stream(),
      ContentType: file.type,
      ContentDisposition: contentDisposition,
      Metadata: metadata,
    },
  });

  try {
    const data = await upload.done();
    console.log('Successfully uploaded file.', data);
    return data;
  } catch (error) {
    console.error('Error uploading file: ', error);
    throw error;
  }
};

// Add the FormData version
export const s3FormDataUpload = async (formData) => {
  const file = formData.get('file');
  const bucket = formData.get('bucket');
  const key = formData.get('key');
  const contentDisposition = formData.get('contentDisposition') || 'inline';
  const metadata = JSON.parse(formData.get('metadata') || '{}');

  const upload = new Upload({
    client: s3Client,
    params: {
      Bucket: bucket,
      Key: key,
      Body: file.stream(),
      ContentType: file.type,
      ContentDisposition: contentDisposition,
      Metadata: metadata,
    },
  });

  try {
    const data = await upload.done();
    console.log('Successfully uploaded file.', data);
    return data;
  } catch (error) {
    console.error('Error uploading file: ', error);
    throw error;
  }
};

// Delete object from S3

export const s3Delete = async ({ bucket, key }) => {
  const params = {
    Bucket: bucket,
    Key: key,
  };

  try {
    const data = await s3Client.send(new DeleteObjectCommand(params));
    console.log('Successfully deleted file.', data);
    return data;
  } catch (error) {
    console.error('Error deleting file: ', error);
    throw error;
  }
};

export const s3GetSignedUrl = async ({ bucket, key, expiresIn = 3600 }) => {
  const params = {
    Bucket: bucket,
    Key: key,
  };

  try {
    const command = new GetObjectCommand(params);
    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn });
    console.log('Successfully generated signed URL:', signedUrl);
    return signedUrl;
  } catch (error) {
    console.error('Error generating signed URL: ', error);
    throw error;
  }
};

export const s3GetBase64 = async ({ bucket, key }) => {
  const params = {
    Bucket: bucket,
    Key: key,
  };
  
  try {
    const command = new GetObjectCommand(params);
    const { Body } = await s3Client.send(command);
    const chunks = [];
    for await (const chunk of Body) chunks.push(chunk);
    const buffer = Buffer.concat(chunks);
    const base64 = buffer.toString("base64");
    return base64;
  } catch (error) {
    console.error("Error: in convertObjectToBase64:", error);
    throw error;
  }
};