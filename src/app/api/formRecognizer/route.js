import { NextResponse } from 'next/server';
import { AZURE_FORM_RECOGNIZER } from 'src/config-global';

import { fConverToNumber } from 'src/utils/format-number';
import { fToCamelCase } from 'src/utils/format-string';
import { handleError } from 'src/utils/format-response';
import { convertConsumersGasElectric } from 'src/models/ConsumersEnergy';

const { DocumentAnalysisClient, AzureKeyCredential } = require('@azure/ai-form-recognizer');
const {
  generateBlobSASQueryParameters,
  BlobSASPermissions,
  StorageSharedKeyCredential,
  BlobServiceClient,
} = require('@azure/storage-blob');

export async function POST(request) {
  const currentDateTime = new Date();
  const batchId = currentDateTime.toISOString().replace(/Z$/, '_EST');

  const { formApiKey, formEndpoint, storageConnectionString, storageContainer } = AZURE_FORM_RECOGNIZER;

  const modelId = 'conusmers_electric_gas';

  const blobServiceClient = BlobServiceClient.fromConnectionString(storageConnectionString);
  const containerClient = blobServiceClient.getContainerClient(storageContainer);
  const client = new DocumentAnalysisClient(formEndpoint, new AzureKeyCredential(formApiKey));

  let sasToken;
  try {
    sasToken = generateContainerSASToken(storageContainer);
  } catch (error) {
    return handleError(error, 'Failed to retrieve SAS Token [Failed at generateSASToken in formRecognizerAPI]');
  }
  const results = [];
  const errors = [];

  const formData = await request.formData();

  const promises = Array.from(formData.entries()).map(async ([fieldName, file]) => {
    let blobUrl;
    try {
      // Upload File to Blob Storage
      const fileName = file.name;
      const fileBuffer = Buffer.from(await file.arrayBuffer());
      const blobName = `submitted/${batchId}/${fileName}`;
      const blockBlobClient = containerClient.getBlockBlobClient(blobName);
      await blockBlobClient.uploadData(fileBuffer);
      blobUrl = `${blockBlobClient.url}?${sasToken}`;
    } catch (err) {
      handleError(err, 'Failed to uplaod File to BlobStorage', false);
      errors.push(file.name);
      return;
    }
    try {
      // Process File from Blob Storage
      const poller = await client.beginAnalyzeDocumentFromUrl(modelId, blobUrl);
      const { documents } = await poller.pollUntilDone();

      // Clean up response and return result
      const restructuredObject = restructureObject(documents[0].fields);
      results.push(convertConsumersGasElectric(restructuredObject));
      return;
    } catch (err) {
      handleError(err, 'Failed to Analyze File With Form Recognizer', false);
      errors.push(file.name);
      return;
    }
  });

  await Promise.all(promises);
  return NextResponse.json({ results, errors }, { status: 200 });
}

// generate SAS token for container

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

// Transform Output to be cleaner

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
