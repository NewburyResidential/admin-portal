'use server';

import { dynamoScan } from '../sdk-config/aws/dynamo-db';

export default async function getSuggestedReceipts() {
  const dynamoSuggestedReceipts = await dynamoScan({ tableName: 'admin_portal_cc_suggested_receipts' });
  const suggestedReceipts = dynamoSuggestedReceipts.Items;
  return suggestedReceipts;
}
