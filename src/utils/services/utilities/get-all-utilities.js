"use server";

import { dynamoScan } from 'src/utils/services/sdk-config/aws/dynamo-db';

export default async function getAllUtilities() {
  const utilities = await dynamoScan({ tableName: 'utilities' });
  return utilities?.Items;
}
