import { getServerSession } from 'next-auth';

import getVendorLocations from 'src/utils/services/entrata/getVendorLocations';
import getAllChartOfAccounts from 'src/utils/services/utility/getAllChartOfAccounts';

import Table from './components/Table';

export default async function page() {
  const [vendors, chartOfAccounts, { user }] = await Promise.all([
    getVendorLocations(),
    getAllChartOfAccounts(),
    getServerSession(),
  ]);

  

  return <Table user={user} vendors={vendors} chartOfAccounts={chartOfAccounts}/>;
}
