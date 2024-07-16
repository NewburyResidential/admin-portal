'use server';

import { revalidatePath, revalidateTag } from 'next/cache';


import { dynamoUpdateItemAttributes } from '../sdk-config/aws/dynamo-db';

export default async function updateEmployee(pk, attributes) {
  try {
   await dynamoUpdateItemAttributes({ tableName: 'newbury_employees', sk: '#EMPLOYEE', pk, attributes: attributes });
    //revalidatePath('/dashboard/employees/'); 
    revalidateTag('employee');

    return true;
  } catch (error) {
    console.error('Error getting item from DynamoDB', error);
    return false;
  }
}
