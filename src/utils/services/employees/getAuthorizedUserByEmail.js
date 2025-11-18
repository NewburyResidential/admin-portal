'use server';

import { dynamoQueryWithIndex } from '../sdk-config/aws/dynamo-db';

export async function getAuthorizedUserByEmail(email) {
  const data = await dynamoQueryWithIndex({
    pkValue: '#EMPLOYEE',
    skValue: '#AUTHORIZED',
    pkName: 'sk',
    skName: 'status',
    tableName: 'newbury_employees',
    index: 'sk-status-index',
  });

  const result =
    data?.find((user) => {
      if (user?.workEmail) {
        return user.workEmail.toLowerCase() === email.toLowerCase();
      }
      return false;
    }) || null;
  return result;
}
