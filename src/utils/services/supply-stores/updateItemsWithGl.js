'use server';

import { dynamoUpdateItemAttributes } from '../sdk-config/aws/dynamo-db';

export default async function updateItemsWithGl(sku, updatedAttributes) {
  await dynamoUpdateItemAttributes({ tableName: 'admin_portal_supply_stores_catalog', pk: sku, attributes: updatedAttributes });
  
}
