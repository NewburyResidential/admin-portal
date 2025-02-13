'use server';

import { dynamoQuery } from '../sdk-config/aws/dynamo-db';

export default async function getBankTransactionsByMonth({ pk }) {
  const transactions = await dynamoQuery({
    tableName: 'admin_portal_expenses',
    pk,
  });
  return transactions;
}
