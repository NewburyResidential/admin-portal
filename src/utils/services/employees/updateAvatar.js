'use server';

import { revalidatePath } from 'next/cache';

import { dynamoUpdateItemAttributes } from '../sdk-config/aws/dynamo-db';

export default async function updateAvatar(pk, url) {
  try {
   await dynamoUpdateItemAttributes({ tableName: 'newbury_employees', sk: '#EMPLOYEE', pk, attributes: { avatar: url } });
    revalidatePath('/onboarding'); // TODO revalidate correctly

    return true;
  } catch (error) {
    console.error('Error getting item from DynamoDB', error);
    return false;
  }
}
