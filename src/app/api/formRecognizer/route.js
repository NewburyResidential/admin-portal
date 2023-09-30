import { NextResponse } from 'next/server';
import { AZURE_FORM_RECOGNIZER } from 'src/config-global';

import { fConverToNumber } from 'src/utils/format-number';
import { fToCamelCase } from 'src/utils/format-string';
import { handleError } from 'src/utils/format-response';
import { convertConsumersGasElectric } from 'src/models/ConsumersEnergy';

import { DocumentAnalysisClient, AzureKeyCredential } from '@azure/ai-form-recognizer';
import { generateBlobSASQueryParameters, BlobSASPermissions, StorageSharedKeyCredential, BlobServiceClient } from '@azure/storage-blob';

export async function POST(request) {
  const batchId = generateBatchId();
  const { storageConnectionString, storageContainer } = AZURE_FORM_RECOGNIZER;
  const containerClient = getContainerClient(storageConnectionString, storageContainer);
  let sasToken
  try {
    //throw Error('Forced Error')
  sasToken = generateContainerSASToken(storageContainer);
} catch (err) {
  return handleError(err, "Failed to generate container SAS token in Form Recognizer API");
}
  const formData = await request.formData();

  const [results, errors] = await processFormData(formData, containerClient, batchId, sasToken);

  return NextResponse.json({ results, errors }, { status: 200 });
}

function generateBatchId() {
  const currentDateTime = new Date();
  return currentDateTime.toISOString().replace(/Z$/, '_EST');
}

function getContainerClient(storageConnectionString, storageContainer) {
  const blobServiceClient = BlobServiceClient.fromConnectionString(storageConnectionString);
  return blobServiceClient.getContainerClient(storageContainer);
}

async function processFormData(formData, containerClient, batchId, sasToken) {
  const results = [];
  const errors = [];

  const promises = Array.from(formData.entries()).map(async ([fieldName, file]) => {
    try {
      //if (file.name === "11.pdf") {throw Error('error')}
      const blobUrl = await uploadFileToBlob(containerClient, file, batchId, sasToken);
      const responseObject = await analyzeDocumentFromBlob(blobUrl);
      results.push(convertConsumersGasElectric(responseObject, blobUrl));
    } catch (err) {
      handleError(err, `Failed for ${file.name}`, false);
      errors.push(file.name);
    }
  });

  await Promise.all(promises);
  return [results, errors];
}

async function uploadFileToBlob(containerClient, file, batchId, sasToken) {
  const fileName = file.name;
  const fileBuffer = Buffer.from(await file.arrayBuffer());
  const blobName = `submitted/${batchId}/${fileName}`;
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);
  await blockBlobClient.uploadData(fileBuffer);
  return `${blockBlobClient.url}?${sasToken}`;
}

async function analyzeDocumentFromBlob(blobUrl) {
  const { formApiKey, formEndpoint } = AZURE_FORM_RECOGNIZER;
  const modelId = 'conusmers_electric_gas';
  const client = new DocumentAnalysisClient(formEndpoint, new AzureKeyCredential(formApiKey));
  const poller = await client.beginAnalyzeDocumentFromUrl(modelId, blobUrl);
  const { documents } = await poller.pollUntilDone();
  return restructureObject(documents[0].fields);
}


function generateContainerSASToken(containerName) {

  const sharedKeyCredential = new StorageSharedKeyCredential(AZURE_FORM_RECOGNIZER.storageName, AZURE_FORM_RECOGNIZER.storageKey);
  const containerSAS = generateBlobSASQueryParameters(
    {
      containerName,
      permissions: BlobSASPermissions.parse('r'),
      startsOn: new Date(),
      expiresOn: new Date(new Date().valueOf() + 86400 * 1000),
    },
    sharedKeyCredential
  ).toString();
  return containerSAS;
 
}

function restructureObject(obj) {
  return Object.entries(obj).reduce((acc, [key, valueObj]) => {
    const camelCaseKey = fToCamelCase(key);
    const value = valueObj.content || (valueObj.kind === 'number' ? fConverToNumber(valueObj.content) : null);
    acc[camelCaseKey] = {
      value,
      confidence: valueObj.confidence,
    };
    return acc;
  }, {});
}
