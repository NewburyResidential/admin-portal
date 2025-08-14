import { dynamoScan } from 'src/utils/services/sdk-config/aws/dynamo-db';

export default async function getAssets() {
  const assets = await dynamoScan({ tableName: 'newbury_assets' });

  // Iterate over assets and extract id from pk value
  const assetsWithId = assets?.Items?.map((asset) => ({
    ...asset,
    id: asset.pk,
  }));

  return assetsWithId;
}
