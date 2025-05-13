"use server";

import { dynamoScan } from 'src/utils/services/sdk-config/aws/dynamo-db';

export default async function getSherwinWilliamsInvoices() {
  const invoices = await dynamoScan({ tableName: 'admin_portal_sherwin_williams_invoices' });
  return invoices?.Items;
}