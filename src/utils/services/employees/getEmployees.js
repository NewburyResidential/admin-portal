'use server';

import { dynamoQuery } from '../sdk-config/aws/dynamo-db';
import { revalidateTag } from 'next/cache';


function restructureEmployeeData(items) {
  const employeeData = {};

  const employeeItem = items.find((item) => item.type === '#EMPLOYEE');
  if (employeeItem) {
    Object.assign(employeeData, employeeItem);
    employeeData.requiredDocuments = [];
    employeeData.otherDocuments = [];
    employeeData.onboarding = {};
  }

  items.forEach((item) => {
    if (item.type === '#DOCUMENT') {
      if (item.required) {
        employeeData.requiredDocuments.push(item);
      } else {
        employeeData.otherDocuments.push(item);
      }
    } else if (item.type === '#ONBOARDING') {
      employeeData.onboarding[item.sk] = item;
    }
  });

  return employeeData;
}

// const getCachedEmployee = unstable_cache(async (pk) => dynamoQuery({ tableName: 'newbury_employees', pk }), ['my-app-user'], {
//   revalidate: false,
//   tags: ['employee'],

// });

export default async function getEmployees(pk) {
  try {
    const data = await dynamoQuery({ tableName: 'newbury_employees', pk })
    const restructuredEmployeeData = restructureEmployeeData(data);
 

    return restructuredEmployeeData;
  } catch (error) {
    console.error('Error getting item from DynamoDB', error);
    return null;
  }
}
