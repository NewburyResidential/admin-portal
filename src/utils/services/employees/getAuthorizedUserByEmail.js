"use server";

import { dynamoQueryWithIndex } from '../sdk-config/aws/dynamo-db';

export async function getAuthorizedUserByEmail(email) {
  const data = await dynamoQueryWithIndex({
    pkValue: '#EMPLOYEE',
    skValue: '#AUTHORIZED',
    pkName: 'type',
    skName: 'status',
    tableName: 'newbury_employees',
    index: 'type-status-index',
  });
  return (
    data?.find(
      (user) => user?.personalEmail?.toLowerCase() === email.toLowerCase() || user?.workEmail?.toLowerCase() === email.toLowerCase()
    ) || null
  );
}
