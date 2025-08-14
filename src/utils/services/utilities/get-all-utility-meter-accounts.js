'use server';

import { dynamoScan } from 'src/utils/services/sdk-config/aws/dynamo-db';
import { unstable_cache } from 'next/cache';

async function getAllUtilitiesRaw() {
  const utilities = await dynamoScan({ tableName: 'utility-meter-accounts' });
  return utilities?.Items;
}


export default unstable_cache(
  getAllUtilitiesRaw,
  ['get-all-utility-meter-accounts'],
  { tags: ['utility-meter-accounts'] } 
);
