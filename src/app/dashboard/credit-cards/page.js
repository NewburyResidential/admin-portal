import { getServerSession } from 'next-auth';

import getVendorLocations from 'src/utils/services/entrata/getVendorLocations';
import getAllChartOfAccounts from 'src/utils/services/utility/getAllChartOfAccounts';
import getSuggestedReceipts from 'src/utils/services/cc-expenses/getSuggestedReceipts';
import Table from './components/Table';
import { authOptions } from 'src/app/api/auth/[...nextauth]/route';
import isAuthorizedToViewPage from 'src/layouts/dashboard/authorization/isAuthorizedToViewPage';
import { dashboardPaths } from 'src/routes/paths';

export default async function page() {
  const [vendors, chartOfAccounts, suggestedReceipts, session] = await Promise.all([
    getVendorLocations(),
    getAllChartOfAccounts(),
    getSuggestedReceipts(),
    getServerSession(authOptions),
  ]);

  isAuthorizedToViewPage(session, dashboardPaths.creditCards.root);

  return <Table user={session?.user} vendorData={vendors} suggestedReceipts={suggestedReceipts} chartOfAccounts={chartOfAccounts} />;
}
