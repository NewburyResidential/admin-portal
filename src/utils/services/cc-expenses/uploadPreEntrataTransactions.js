'use server';

import { AWS_CONFIG, ENTRATA_API } from 'src/config-global';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import axios from 'axios';
import { DynamoDBDocumentClient, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import fetch from 'node-fetch';

const dynamoClient = new DynamoDBClient(AWS_CONFIG);
const dynamoDocumentClient = DynamoDBDocumentClient.from(dynamoClient);

export async function uploadPreEntrataTransactions(transaction, assetId) {
  const entrataBaseUrl = 'https://newburyresidential.entrata.com/api/v1/vendors';
  const { username } = ENTRATA_API;
  const { password } = ENTRATA_API;
  console.log('username:', username);
  console.log('password:', password);

  const postData = await buildEntrataApiPayload(transaction, assetId);

  try {
    const response = await axios.post(entrataBaseUrl, postData, {
      auth: {
        username,
        password,
      },
    });
    const { data } = response;
    console.log('Entrata response:', response);
    if (data?.response?.code !== 200) {
      throw new Error(`Error sending Entrata transaction: ${data.response}`);
    }

    try {
      const dynamoResponse = await dynamoUpdateItemAttributes({
        tableName: 'admin_portal_expenses',
        pk: transaction.billingCycle,
        sk: transaction.sk,
        attributes: { preEntrataEntered: true },
      });
      console.log('DynamoDB response:', dynamoResponse);
    } catch (error) {
      throw new Error('Error updating DynamoDB item:', error);
    }
    return data;
  } catch (error) {
    console.error('Error sending Entrata transaction:', error);
    throw error;
  }
}

async function buildEntrataApiPayload(transaction, assetId) {
  const receipt = transaction.tempPdfReceipt || null;
  const files = await getFiles(receipt);

  const invoiceDate = convertDateFormat(transaction.postDate);
  const apDetails = buildApDetails(transaction, assetId);

  return {
    auth: {
      type: 'basic',
    },
    requestId: '15',
    method: {
      name: 'sendInvoices',
      version: 'r2',
      params: {
        apBatch: {
          isPaused: '0',
          isPosted: '1',
          apHeaders: {
            apHeader: [
              {
                apPayeeId: transaction.apPayeeId,
                apPayeeLocationId: transaction.apPayeeLocationId,
                invoiceNumber: `CC - Manual: ${transaction.transactionId}`,
                invoiceDate,
                dueDate: invoiceDate,
                invoiceTotal: transaction.amount.toString(),
                note: `CC From ${transaction.purchasedBy} for item: ${transaction.name}\nApproved by: ${transaction.approvedBy}`,
                isOnHold: '0',
                isConsolidated: '0',
                apDetails: {
                  apDetail: apDetails,
                },
                files: {
                  file: files,
                },
              },
            ],
          },
        },
      },
    },
  };
}

async function getFiles(receipt) {
  const files = [];
  if (receipt) {
    const base64Image = await convertImageToBase64(receipt);
    if (base64Image) {
      files.push({ fileName: 'Receipt.pdf', fileData: base64Image });
    }
  }
  return files;
}

function buildApDetails(transaction, assetId) {
  return {
    propertyId: assetId,
    glAccountId: transaction.glAccountId,
    description: transaction.note || '.',
    rate: transaction.amount.toString(),
  };
}

async function convertImageToBase64(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error fetching image: ${response.statusText}`);
    }
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64 = buffer.toString('base64');

    return base64;
  } catch (error) {
    console.error('Error: converting image to Base64:', error);
    return null;
  }
}

function convertDateFormat(dateString) {
  const parts = dateString.split('-');
  return `${parts[1]}/${parts[2]}/${parts[0]}`;
}

export async function dynamoUpdateItemAttributes({ tableName, pk, sk, attributes }) {
  let updateExpression = 'SET';
  const expressionAttributeNames = {};
  const expressionAttributeValues = {};
  let firstItem = true;

  for (const [attributeName, attributeValue] of Object.entries(attributes)) {
    if (!firstItem) {
      updateExpression += ',';
    }
    const attributePlaceholder = `#${attributeName}`;
    const valuePlaceholder = `:${attributeName}`;
    updateExpression += ` ${attributePlaceholder} = ${valuePlaceholder}`;
    expressionAttributeNames[attributePlaceholder] = attributeName;
    expressionAttributeValues[valuePlaceholder] = attributeValue;
    firstItem = false;
  }

  const params = {
    TableName: tableName,
    Key: { pk, sk },
    UpdateExpression: updateExpression,
    ExpressionAttributeNames: expressionAttributeNames,
    ExpressionAttributeValues: expressionAttributeValues,
    ReturnValues: 'UPDATED_NEW',
  };

  try {
    const response = await dynamoDocumentClient.send(new UpdateCommand(params));
    console.log('Update operation successful:', response);
    return response;
  } catch (error) {
    console.error('Error updating item in DynamoDB:', error);
    throw error; // Propagate errors for proper handling.
  }
}
