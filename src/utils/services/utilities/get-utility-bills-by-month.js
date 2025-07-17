"use server";

import { dynamoQuery } from "../sdk-config/aws/dynamo-db";

export default async function getUtilityBillsByMonth(searchParams) {
  const { period, propertyId, utilityId, status } = searchParams;
  
  const response = await dynamoQuery({ 
    tableName: 'admin_portal_utility_bills_ai_analyzer', 
    pk: period 
  });

  // Filter the results on the server

  const otherFiltered = response.filter(bill => {
    const matchesProperty = bill.propertyId === propertyId;
    //const matchesUtility = bill.utilityVendor === utilityId;
    return matchesProperty;
  });
  console.log('otherFiltered', otherFiltered)
  console.log('utilityId', utilityId)
  
  const filtered = response.filter(bill => {
    const matchesProperty = bill.propertyId === propertyId;
    const matchesUtility = bill.utilityVendor === utilityId;
  

    // Check status if it's specified and not 'all'
    const matchesStatus = !status || status === 'all' || bill.status === status;

    return matchesProperty && matchesUtility && matchesStatus;
  });

  console.log('Filtered bills:', filtered);
  return filtered;
}

