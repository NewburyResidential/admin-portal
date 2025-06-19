'use server';

import { dynamoQueryWithIndex } from '../sdk-config/aws/dynamo-db';

export default async function getSuggestedReceiptsByUploader(uploader) {
  const dynamoSuggestedReceipts = await dynamoQueryWithIndex({ tableName: 'admin_portal_cc_suggested_receipts', index: 'uploadedBy-index', pkName: 'uploadedBy', pkValue: uploader });
  return dynamoSuggestedReceipts;
}
