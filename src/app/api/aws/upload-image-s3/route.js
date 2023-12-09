import { Upload } from '@aws-sdk/lib-storage';
import { S3Client } from '@aws-sdk/client-s3';
import { NextResponse } from 'next/server';

const s3Client = new S3Client({
  region: 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export async function POST(req) {
  const formData = await req.formData();
  const Bucket = formData.get('bucket')
  const file = formData.get('file');
  const filename = file.name;

  const upload = new Upload({
    client: s3Client,
    params: {
      Bucket,
      Key: filename,
      Body: file.stream(),
    },
  });

  try {
    await upload.done();
    const fileUrl = `https://${Bucket}.s3.amazonaws.com/${encodeURIComponent(filename)}`;
    return NextResponse.json({ fileUrl }, { status: 200 });
  } catch (error) {
    console.error('Error uploading image:', error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
