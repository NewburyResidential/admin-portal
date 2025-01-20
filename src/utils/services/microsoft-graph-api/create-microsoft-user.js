'use server';

import { revalidateTag } from 'next/cache';
import axios from 'axios';
import getMicrosoftAccessToken from './get-microsoft-access-token';
import * as Sentry from '@sentry/nextjs';

import snackbarSuccessResponse from 'src/components/response-snackbar/utility/snackbarSuccessResponse';
import snackbarCatchErrorResponse from 'src/components/response-snackbar/utility/snackbarCatchErrorResponse';
import snackbarStatusErrorResponse from 'src/components/response-snackbar/utility/snackbarStatusErrorResponse';
import { dynamoUpdateItemAttributes } from '../sdk-config/aws/dynamo-db';
import updateWorkEmail from '../paylocity/update-work-email';

const graphApiUrl = 'https://graph.microsoft.com/v1.0/users';

export default async function createMicrosoftUser({ pk, displayName, mailNickname, userPrincipalName }) {
  const snackbarResponses = [];
  Sentry.setTag('functionName', 'createUser');
  Sentry.addBreadcrumb({
    category: 'data',
    message: 'Data passed to createUser',
    level: 'info',
    data: { displayName, mailNickname, userPrincipalName },
  });

  const errorTitle = 'Error creating user';

  const dynamoSuccessTitle = 'DynamoDB User Updated successfully';
  const dynamoErrorTitle = 'Error updating user in DynamoDB';

  const azureSuccessTitle = 'Azure AD User created successfully';
  const azureErrorTitle = 'Error creating user in Azure AD';

  const paylocitySuccessTitle = 'Paylocity Email Updated successfully';
  const paylocityErrorTitle = 'Error updating email in Paylocity';

  const expectedAzureStatus = 201;

  const userPayload = {
    accountEnabled: true,
    displayName,
    mailNickname,
    userPrincipalName,
    passwordProfile: {
      forceChangePasswordNextSignIn: true,
      password: 'NewburyResidential!',
    },
  };

  try {
    const accessToken = await getMicrosoftAccessToken();
    const azureResponse = await axios.post(graphApiUrl, userPayload, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      validateStatus: (status) => true,
    });

    const azureResponseStatus = azureResponse.status;
    const azureResponseData = azureResponse.data;

    if (azureResponseStatus !== expectedAzureStatus) {
      return snackbarStatusErrorResponse(azureResponseData, azureResponseStatus, expectedAzureStatus, azureErrorTitle);
    }
    snackbarResponses.push(snackbarSuccessResponse(azureResponseData, azureSuccessTitle));

    try {
      const dynamoResponse = await dynamoUpdateItemAttributes({
        tableName: 'newbury_employees',
        sk: '#EMPLOYEE',
        pk,
        attributes: { workEmail: 'syncing' },
      });
      const dynamoResponseStatus = dynamoResponse?.$metadata.httpStatusCode;
      const dynamoExpectedStatus = 200;

      if (dynamoResponseStatus !== dynamoExpectedStatus) {
        snackbarResponses.push(snackbarStatusErrorResponse(dynamoResponse, dynamoResponseStatus, dynamoExpectedStatus, dynamoErrorTitle));
        return snackbarResponses;
      }
      snackbarResponses.push(snackbarSuccessResponse(dynamoResponse, dynamoSuccessTitle));

      try {
        const paylocityResponse = await updateWorkEmail(pk, userPrincipalName);
        const paylocityResponseStatus = paylocityResponse?.status;
        const paylocityResponseData = paylocityResponse?.data;
        const paylocityExpectedStatus = 200;

        if (paylocityResponseStatus !== paylocityExpectedStatus) {
          snackbarResponses.push(
            snackbarStatusErrorResponse(paylocityResponseData, paylocityResponseStatus, paylocityExpectedStatus, paylocityErrorTitle)
          );
          return snackbarResponses;
        }
        snackbarResponses.push(snackbarSuccessResponse(paylocityResponseData, paylocitySuccessTitle));
        return snackbarResponses;
      } catch (error) {
        snackbarResponses.push(snackbarCatchErrorResponse(error, paylocityErrorTitle));
        return snackbarResponses;
      }
    } catch (error) {
      snackbarResponses.push(snackbarCatchErrorResponse(error, dynamoErrorTitle));
      return snackbarResponses;
    }
  } catch (error) {
    console.log('tf?', 'j');
    snackbarResponses.push(snackbarCatchErrorResponse(error, errorTitle));
    return snackbarResponses;
  } finally {
    revalidateTag('employees');
  }
}
