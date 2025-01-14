import { dynamoScan } from 'src/utils/services/sdk-config/aws/dynamo-db';

export default async function getAssets() {
  const assets = await dynamoScan({ tableName: 'newbury_assets' });
  return assets?.Items;
}
