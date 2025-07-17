'use server';

import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import Big from 'big.js';
import { dynamoUpdateItemAttributes } from '../sdk-config/aws/dynamo-db';
import { getTodaysDate } from '../../format-time';
import snackbarSuccessResponse from 'src/components/response-snackbar/utility/snackbarSuccessResponse';
import snackbarCatchErrorResponse from 'src/components/response-snackbar/utility/snackbarCatchErrorResponse';
import snackbarStatusErrorResponse from 'src/components/response-snackbar/utility/snackbarStatusErrorResponse';
import { ENTRATA_API, ENTRATA_API_KEY } from 'src/config-global';

const tableName = 'admin_portal_utility_bills_ai_analyzer';

export default async function enterUtilityBillbacks(billbacks) {
  const transactions = [];
  const date = getTodaysDate();
  const electricBillbackCode = 59362;
  const waterBillbackCode = 59363;
  const gasBillbackCode = 59380;
  const adminFeeCode = 59381;

  for (const billback of billbacks) {
    const proratedAmount = new Big(billback.proratedAmount);

    // Calculate the percentage of each utility type
    const waterAmount = billback.waterSewerAmount ? new Big(billback.waterSewerAmount) : Big(0);
    const electricAmount = billback.electricAmount ? new Big(billback.electricAmount) : Big(0);
    const gasAmount = billback.gasAmount ? new Big(billback.gasAmount) : Big(0);

    const totalUtilityAmount = waterAmount.plus(electricAmount).plus(gasAmount);

    if (totalUtilityAmount.eq(0)) {
      console.warn('Total utility amount is zero, skipping billback:', billback);
    } else {
      const waterPercent = waterAmount.div(totalUtilityAmount);
      const electricPercent = electricAmount.div(totalUtilityAmount);
      const gasPercent = gasAmount.div(totalUtilityAmount);

      // Create transactions for each utility type
      if (!waterAmount.eq(0)) {
        const waterTransaction = {
          transactionId: uuidv4(),
          leaseId: billback.leaseId,
          arCodeId: waterBillbackCode,
          transactionDate: date,
          transactionAmount: proratedAmount.times(waterPercent).round(2).toString(),
          description: billback.description,
          useApprovalRouting: '1',
        };
        transactions.push(waterTransaction);
      }

      if (!electricAmount.eq(0)) {
        const electricTransaction = {
          transactionId: uuidv4(),
          leaseId: billback.leaseId,
          arCodeId: electricBillbackCode,
          transactionDate: date,
          transactionAmount: proratedAmount.times(electricPercent).round(2).toString(),
          description: billback.description,
          useApprovalRouting: '1',
        };
        transactions.push(electricTransaction);
      }

      if (!gasAmount.eq(0)) {
        const gasTransaction = {
          transactionId: uuidv4(),
          leaseId: billback.leaseId,
          arCodeId: gasBillbackCode,
          transactionDate: date,
          transactionAmount: proratedAmount.times(gasPercent).round(2).toString(),
          description: billback.description,
          useApprovalRouting: '1',
        };
        transactions.push(gasTransaction);
      }

      // Add one admin fee transaction if daysProrated is greater than 3
      if (billback.daysProrated > 3) {
        const adminFeeTransaction = {
          transactionId: uuidv4(),
          leaseId: billback.leaseId,
          arCodeId: adminFeeCode,
          transactionDate: date,
          transactionAmount: '35',
          description: billback.description,
          useApprovalRouting: '1',
        };
        transactions.push(adminFeeTransaction);
      }
    }
  }

  const responses = [];

  try {
    const response = await sendEntrataTransaction(transactions);
    const entrataResponse = response?.data;
    const responseStatus = entrataResponse?.response?.code;
    const expectedStatus = 200;

    if (responseStatus === expectedStatus) {
      responses.push(snackbarSuccessResponse(entrataResponse, 'Entrata Transactions Posted'));

      for (const billback of billbacks) {
        try {
          await dynamoUpdateItemAttributes({
            tableName,
            pk: billback.pk,
            sk: billback.sk,
            attributes: { billedback: true },
          });
          responses.push(snackbarSuccessResponse(billback, 'Billback Updated Successfully'));
        } catch (error) {
          responses.push(snackbarCatchErrorResponse(error, 'Error Updating Billback'));
        }
      }
    } else {
      responses.push(snackbarStatusErrorResponse(entrataResponse, responseStatus, expectedStatus, 'Error Posting Entrata Transactions'));
    }
  } catch (error) {
    responses.push(snackbarCatchErrorResponse(error, 'Error Sending Transactions to Entrata'));
  }

  return responses; // Return the array of responses
}

async function sendEntrataTransaction(transactions) {
  const entrataBaseUrl = `${ENTRATA_API.baseUrl}/artransactions`;

  const postData = {
    auth: {
      type: 'apikey',
    },
    requestId: '15',
    method: {
      name: 'sendLeaseArTransactions',
      params: {
        transaction: transactions,
      },
    },
  };

  try {
    const response = await axios.post(entrataBaseUrl, postData, {
      headers: {
        'X-Api-Key': ENTRATA_API_KEY,
        'Content-Type': 'application/json',
      },
    });
    return response;
  } catch (error) {
    console.error('Error sending Entrata transaction:', error);
    throw error;
  }
}
