import { dynamoQueryWithIndex } from '../sdk-config/aws/dynamo-db';

export default async function getUnapprovedTransactions() {
  const unCategorizedResponse = await dynamoQueryWithIndex({
    tableName: 'admin_portal_expenses',
    index: 'status-index',
    pkName: 'status',
    pkValue: 'unapproved',
  });

  const categorizedResponse = await dynamoQueryWithIndex({
    tableName: 'admin_portal_expenses',
    index: 'status-index',
    pkName: 'status',
    pkValue: 'categorized',
  });

  return [...unCategorizedResponse, ...categorizedResponse];
}
