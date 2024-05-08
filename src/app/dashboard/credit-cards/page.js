import { getServerSession } from 'next-auth';

import getVendorLocations from 'src/utils/services/entrata/getVendorLocations';
import getAllChartOfAccounts from 'src/utils/services/utility/getAllChartOfAccounts';
import getSuggestedReceipts from 'src/utils/services/cc-expenses/getSuggestedReceipts';
import Table from './components/Table';

export default async function page() {
  const [vendors, chartOfAccounts, suggestedReceipts, { user }] = await Promise.all([
    getVendorLocations(),
    getAllChartOfAccounts(),
    getSuggestedReceipts(),
    getServerSession(),
  ]);

  return <Table user={user} vendorData={vendors} suggestedReceipts={suggestedReceipts} chartOfAccounts={chartOfAccounts}/>;
  
}
