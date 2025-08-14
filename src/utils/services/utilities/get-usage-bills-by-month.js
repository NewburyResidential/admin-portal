"use server";

import { dynamoQuery } from "../sdk-config/aws/dynamo-db";

export default async function getUsageBillsByMonth(period) {

  const response = await dynamoQuery({ 
    tableName: 'admin_portal_utility_bills_ai_analyzer', 
    pk: period ,
  });
  console.log(response);

  return response;
}