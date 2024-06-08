export const dynamic = 'force-dynamic';

import { dynamoQuery } from '../sdk-config/aws/dynamo-db';
function restructureEmployeeData(items) {
  const employeeData = {};

  const employeeItem = items.find((item) => item.type === '#EMPLOYEE');
  if (employeeItem) {
    Object.assign(employeeData, employeeItem);
    employeeData.requiredDocuments = [];
    employeeData.otherDocuments = [];
  }

  items.forEach((item) => {
    if (item.type === '#DOCUMENT') {
      if (item.required) {
        employeeData.requiredDocuments.push(item);
      } else {
        employeeData.otherDocuments.push(item);
      }
    }
  });

  return employeeData;
}

export default async function getEmployee(pk) {
  try {
    const params = {
      TableName: 'newbury_employees',
      KeyConditionExpression: 'pk = :pk',
      ExpressionAttributeValues: {
        ':pk': pk,
      },
    };

    const data = await dynamoQuery(params);
    const restructuredEmployeeData = restructureEmployeeData(data);

    return restructuredEmployeeData;
  } catch (error) {
    console.error('Error getting item from DynamoDB', error);
  }
}
