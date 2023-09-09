import { NextResponse } from 'next/server';
const { DocumentProcessorServiceClient } = require('@google-cloud/documentai').v1beta3;
const { Storage } = require('@google-cloud/storage');

const client = new DocumentProcessorServiceClient();
const storage = new Storage();

export async function POST(request) {
  const currentDateTime = new Date();
  const batchId = currentDateTime.toISOString().replace(/Z$/, '_EST');

  const bucketName = 'pdf-bucket-storage-1';
  const projectId = '609778734661';
  const location = 'us';
  const processorId = '7d699c35756df498';
  const gcsOutputUri = 'gs://pdf-bucket-storage-1';
  const gcsOutputUriPrefix = `${batchId}/output`;
  const name = `projects/${projectId}/locations/${location}/processors/${processorId}`;

  try {
    const formData = await request.formData();
    const documentResponses = []; // Store document responses herel
    const uploadedDocuments = []; // Store uploaded document objects here

    for (const [fieldName, file] of formData.entries()) {
      const fileName = file.name;
      const fileBuffer = Buffer.from(await file.arrayBuffer());
      // Upload the file to GCS
      await storage.bucket(bucketName).file(`${batchId}/input/${fileName}`).save(fileBuffer);
      console.log(`Uploaded ${fileName} to GCS bucket.`);

      // Create a document object for the uploaded file
      const gcsUri = `gs://${bucketName}/${batchId}/input/${fileName}`;
      const mimeType = file.type; //Review for png etc
      uploadedDocuments.push({ gcsUri, mimeType });
    }

    const batchRequest = {
      name,
      inputDocuments: {
        gcsDocuments: {
          documents: uploadedDocuments,
        },
      },
      outputConfig: {
        gcsDestination: `${gcsOutputUri}/${gcsOutputUriPrefix}/`,
      },
    };

    // Trigger Document AI processing for the current document
    const [operation] = await client.batchProcessDocuments(batchRequest);
    console.log(`Started batch processing`);
    const response = await operation.promise();


    const query = {
      prefix: gcsOutputUriPrefix,
    };

    console.log('Fetching results ...');

    // List all of the files in the Storage bucket
    const [files] = await storage.bucket(gcsOutputUri).getFiles(query);
    for (const fileInfo of files) {
      const [file] = await fileInfo.download();
      const document = JSON.parse(file.toString());
      const entities = document?.entities || []
      documentResponses.push(entities);
    }

    // Return the document responses in the JSON response to the client
    return new Response(
      JSON.stringify({documentResponses}),
      {
        headers: { 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error uploading files:', error);
    return new Response('File upload and processing failed.', {
      status: 500,
    });
  }
}
