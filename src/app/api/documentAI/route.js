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
    const billImageLinks = []
    const entitiesArray = [];

    for (const [fieldName, file] of formData.entries()) {
      const fileName = file.name;
      const fileBuffer = Buffer.from(await file.arrayBuffer());
      billImageLinks.push(`https://storage.cloud.google.com/${bucketName}/${batchId}/input/${fileName}?authuser=3`)
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
    for (const [index, fileInfo] of files.entries()) {
      const [file] = await fileInfo.download();
      const document = JSON.parse(file.toString());
      const entities = document?.entities || [];


      // TODO HANDLE THIS ELSEWHERE

      const result = {
        gas: {},
        electric: {},
      };

      entities.forEach((item) => {
        const { mentionText, confidence, type } = item;

        if (type === 'Account') {
          result.gas.accountNumber = { value: mentionText, confidence };
          result.electric.accountNumber = { value: mentionText, confidence };
        } else if (type === 'Bill_Month') {
          result.gas.billMonth = { value: mentionText, confidence };
          result.electric.billMonth = { value: mentionText, confidence };
        } else if (type === 'Gas_Meter_Number') {
          result.gas.meterNumber = { value: mentionText, confidence };
        } else if (type === 'Gas_Beginning_Read_Date') {
          result.gas.startReadDate = { value: mentionText, confidence };
        } else if (type === 'Gas_Ending_Read_Date') {
          result.gas.endReadDate = { value: mentionText, confidence };
        } else if (type === 'Total_Natural_Gas') {
          result.gas.amount = { value: mentionText, confidence };
        } else if (type === 'Electric_Meter_Number') {
          result.electric.meterNumber = { value: mentionText, confidence };
        } else if (type === 'Electric_Beginning_Read_Date') {
          result.electric.startReadDate = { value: mentionText, confidence };
        } else if (type === 'Electric_Ending_Read_Date') {
          result.electric.endReadDate = { value: mentionText, confidence };
        } else if (type === 'Total_Electric') {
          result.electric.amount = { value: mentionText, confidence };
        }
      });
      if (Object.keys(result.gas).length > 2) {
        documentResponses.push({
          id: 1,
          utilityType: 'gas',
          billImageLink: billImageLinks[index],
          meterNumber: result.gas.meterNumber.value,
          billMonth: result.gas.billMonth.value,
          startReadDate: result.gas.startReadDate.value,
          endReadDate: result.gas.endReadDate.value,
          amount: result.gas.amount.value,
          confidence: {
            meterNumber: result.gas.meterNumber.confidence,
            billMonth: result.gas.billMonth.confidence,
            startReadDate: result.gas.startReadDate.confidence,
            endReadDate: result.gas.endReadDate.confidence,
            amount: result.gas.amount.confidence
          },
        });
      }

      if (Object.keys(result.electric).length > 2) {
        documentResponses.push({
          id: 1,
          utilityType: 'electric',
          billImageLink: billImageLinks[index],
          meterNumber: result.electric.meterNumber.value,
          billMonth: result.electric.billMonth.value,
          startReadDate: result.electric.startReadDate.value,
          endReadDate: result.electric.endReadDate.value,
          amount: result.electric.amount.value,
          confidence: {
            meterNumber: result.electric.meterNumber.confidence,
            billMonth: result.electric.billMonth.confidence,
            startReadDate: result.electric.startReadDate.confidence,
            endReadDate: result.electric.endReadDate.confidence,
            amount: result.electric.amount.confidence
          },
        });
      }

      entitiesArray.push(document);
    }

    // Return the document responses in the JSON response to the client
    return new Response(JSON.stringify({ documentResponses }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Error uploading files:', error);
    return new Response('File upload and processing failed.', {
      status: 500,
    });
  }
}
