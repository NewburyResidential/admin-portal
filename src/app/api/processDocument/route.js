import { NextResponse } from 'next/server';
const { DocumentProcessorServiceClient } = require('@google-cloud/documentai').v1beta3;

export async function GET(req, res) {
  const googleCredentials = JSON.parse(process.env.GOOGLE_CREDENTIALS || '{}');
  const project_id = '609778734661';
  const location = 'us';
  const processor_id = '9bbdea563b5e2c4a';
  const file_path = 'public/bill.pdf';

  // Create a Document AI client
  const client = new DocumentProcessorServiceClient({
    credentials: googleCredentials, 
    projectId: project_id, 
  });
  const name = `projects/${project_id}/locations/${location}/processors/${processor_id}`;

  // Pdf to Base64Content
  const fs = require('fs');
  const content = fs.readFileSync(file_path);
  const base64Content = content.toString('base64');

  const request = {
    name,
    document: {
      content: base64Content,
      mimeType: 'application/pdf',
    },
  };

  try {
    const [result] = await client.processDocument(request);
    for (const entity of result.document.entities) {
      console.log(`Entity type: ${entity.type}`);
      console.log(`Entity value: ${entity.mentionText}`);
    }

    return NextResponse.json({ message: 'Document processed successfully' });
  } catch (error) {
    console.error('Error processing document:', error);
    return NextResponse.json({ error: 'Error processing document' });
  }
}
