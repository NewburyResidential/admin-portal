'use server';

import { dynamoUpdateItemAttributes } from '../sdk-config/aws/dynamo-db';

export async function updateSignedDocument(pk, sk, status) {
  const dynamoDbResponse = await dynamoUpdateItemAttributes({
    tableName: 'newbury_employees',
    pk,
    sk: `#DOCUMENT#${sk}`,
    attributes: {
      status,
    },
  });
  if (!dynamoDbResponse) {
    return false;
  }

  return true;
}
