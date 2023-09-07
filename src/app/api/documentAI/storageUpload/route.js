import { NextResponse } from 'next/server';
const { DocumentProcessorServiceClient } = require('@google-cloud/documentai').v1beta3;
const { Storage } = require('@google-cloud/storage');

const client = new DocumentProcessorServiceClient();
const storage = new Storage();

const bucketName = 'pdf-bucket-storage-1'; // Replace with your GCS bucket name
const projectId = '609778734661';
const location = 'us';
const processorId = '9bbdea563b5e2c4a';
const gcsOutputUri = 'gs://pdf-bucket-storage-1';
const gcsOutputUriPrefix = 'output/results'; // Replace with your desired prefix

const name = `projects/${projectId}/locations/${location}/processors/${processorId}`;

export async function POST(request) {
  try {
    const formData = await request.formData();
    const processingPromises = [];
    const documentResponses = []; // Store document responses here

    for (const [fieldName, file] of formData.entries()) {
      const fileName = file.name;
      const fileBuffer = Buffer.from(await file.arrayBuffer());

      // Upload the file to GCS
      const uploadPromise = storage.bucket(bucketName).file(fileName).save(fileBuffer);
      console.log(`Uploaded ${fileName} to GCS bucket.`);

      const gcsInputUri = `gs://${bucketName}/${fileName}`;

      const docRequest = {
        name,
        inputConfigs: [
          {
            gcsSource: gcsInputUri,
            mimeType: 'application/pdf',
          },
        ],
        outputConfig: {
          gcsDestination: `${gcsOutputUri}/${gcsOutputUriPrefix}/`,
        },
      };

      // Trigger Document AI processing for the current document without waiting
      const processingPromise = client.batchProcessDocuments(docRequest);

      // Add a status update promise to log when processing is complete
      const statusUpdatePromise = processingPromise
        .then(([operation]) => {
          console.log(`Started Document AI processing for ${fileName}`);
          return operation.promise().then((response) => {
            console.log(`Document AI processing complete for ${fileName}`);
            // Store the response in the array
            documentResponses.push({ fileName, response });
          });
        });

      processingPromises.push(statusUpdatePromise);

      // Continue uploading and processing the next document while this one is processing
      await uploadPromise;
    }

    // Wait for all processing operations and status updates to complete
    await Promise.all(processingPromises);
    console.log('All Document AI processing completed.');
    console.log(documentResponses)
    // Return the document responses in the JSON response to the client
    return new Response(
      JSON.stringify({ message: 'Files uploaded and processed successfully', documentResponses }),
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