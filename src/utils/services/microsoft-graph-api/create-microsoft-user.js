'use server';

import { revalidateTag } from 'next/cache';
import axios from 'axios';
import getAccessToken from './get-access-token';
import * as Sentry from '@sentry/nextjs';

import snackbarSuccessResponse from 'src/components/response-snackbar/utility/snackbarSuccessResponse';
import snackbarCatchErrorResponse from 'src/components/response-snackbar/utility/snackbarCatchErrorResponse';
import snackbarStatusErrorResponse from 'src/components/response-snackbar/utility/snackbarStatusErrorResponse';
import { dynamoUpdateItemAttributes } from '../sdk-config/aws/dynamo-db';

const graphApiUrl = 'https://graph.microsoft.com/v1.0/users';

export default async function createMicrosoftUser({ pk, displayName, mailNickname, userPrincipalName }) {
  Sentry.setTag('functionName', 'createUser');
  Sentry.addBreadcrumb({
    category: 'data',
    message: 'Data passed to createUser',
    level: 'info',
    data: { displayName, mailNickname, userPrincipalName },
  });

  const successTitle = 'User created successfully';
  const errorTitle = 'Error creating user';
  const expectedUserStatus = 201; // Use 201 Created for new user creation

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
    const accessToken = await getAccessToken();
    const response = await axios.post(graphApiUrl, userPayload, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    const responseStatus = response.status;
    const responseData1 = response.data;

    if (responseStatus === expectedUserStatus) {
      try {
        const dynamoResponse = await dynamoUpdateItemAttributes({
          tableName: 'newbury_employees',
          sk: '#EMPLOYEE',
          pk,
          attributes: { workEmail: 'syncing' },
        });
        const dynamoResponseStatus = dynamoResponse?.$metadata.httpStatusCode;
        const dynamoExpectedStatus = 200;

        if (dynamoResponseStatus === dynamoExpectedStatus) {
          revalidateTag('employees');
          return snackbarSuccessResponse([responseData1, dynamoResponse], successTitle);
        } 
          return snackbarStatusErrorResponse(dynamoResponse, dynamoResponseStatus, dynamoExpectedStatus, errorTitle);
        
      } catch (error) {
        throw new Error(`User created, but failed to update DynamoDB: ${error.message}`);
      }
    }
    return snackbarStatusErrorResponse(responseData1, responseStatus, expectedUserStatus, errorTitle);
  } catch (error) {
    return snackbarCatchErrorResponse(error, errorTitle);
  }
}
