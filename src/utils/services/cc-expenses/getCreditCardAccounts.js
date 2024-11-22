import { dynamoScan } from '../sdk-config/aws/dynamo-db';

export const getCreditCardAccounts = async () => {
  const response = await dynamoScan({ tableName: 'admin_portal_cc_expenses_accounts' });
  const creditCardAccounts = response?.Items;
  return creditCardAccounts;
};
