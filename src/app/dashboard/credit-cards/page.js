import { getServerSession } from 'next-auth';

import Table from './components/Table';
import getVendorLocations from 'src/utils/services/entrata/getVendorLocations';
import getAllChartOfAccounts from 'src/utils/services/utility/getAllChartOfAccounts';
import getUnapprovedTransactions from 'src/utils/services/cc-expenses/getUnapprovedTransactions';

export default async function page() {
  const [vendors, chartOfAccounts, unapprovedTransactions, {user}] = await Promise.all([
    getVendorLocations(),
    getAllChartOfAccounts(),
    getUnapprovedTransactions(),
    getServerSession(),
  ]);

  unapprovedTransactions.sort((a, b) => {
    return new Date(a.transactionDate) - new Date(b.transactionDate);
  });

  return <Table user={user} vendors={vendors} chartOfAccounts={chartOfAccounts} unapprovedTransactions={unapprovedTransactions} />;
}
