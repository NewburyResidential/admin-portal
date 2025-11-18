'use server';

import { AWS_CONFIG, ENTRATA_API_KEY, ENTRATA_API } from 'src/config-global';
import { dynamoUpdateItemAttributes } from '../sdk-config/aws/dynamo-db';
import axios from 'axios';

export async function uploadPreEntrataTransactions(transaction, assetId) {
  console.log('starting');
  const entrataBaseUrl = `${ENTRATA_API.baseUrl}/v1/vendors`;
  console.log('transaction', transaction);

  const postData = await buildEntrataApiPayload(transaction, assetId);

  try {
    const response = await axios.post(entrataBaseUrl, postData, {
      headers: {
        'X-Api-Key': ENTRATA_API_KEY,
        'Content-Type': 'application/json',
      },
    });

    const data = response.data;
    console.log('Entrata response:', data);

    // Only update DynamoDB if the Entrata API call was successful
    if (data?.response?.code === 200) {
      try {
        const dynamoResponse = await dynamoUpdateItemAttributes({
          tableName: 'admin_portal_expenses',
          pk: transaction.pk,
          sk: transaction.id,
          attributes: { preEntrataEntered: true },
        });
        console.log('DynamoDB response:', dynamoResponse);
      } catch (error) {
        console.log('Error updating DynamoDB item:', error);
        return data;
      }
    } else {
      console.log('Entrata API call failed, not updating DynamoDB');
      return data; // Return the failed response instead of throwing
    }

    return data;
  } catch (error) {
    console.log('Error sending Entrata transaction:', error);
    return { error: error.response?.data || error.message };
  }
}

async function buildEntrataApiPayload(transaction, assetId) {
  const receipt = transaction.tempPdfReceipt || null;
  const files = await getFiles(receipt);

  const invoiceDate = convertDateFormat(transaction.postDate);
  const apDetails = buildApDetails(transaction, assetId);

  return {
    auth: {
      type: 'apikey',
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
