import { getServerSession } from 'next-auth';

import Table from './components/Table';
import getVendorLocations from 'src/utils/services/entrata/getVendorLocations';
import getChartOfAccounts from 'src/utils/services/entrata/getChartOfAccounts';
import getUnapprovedTransactions from 'src/utils/services/CCExpenses/getUnapprovedTransactions';

export default async function page() {
  const [vendors, chartOfAccounts, unapprovedTransactions, {user}] = await Promise.all([
    getVendorLocations(),
    getChartOfAccounts(),
    getUnapprovedTransactions(),
    getServerSession(),
  ]);

  unapprovedTransactions.sort((a, b) => {
    return new Date(a.transactionDate) - new Date(b.transactionDate);
  });

  return <Table user={user} vendors={vendors} chartOfAccounts={chartOfAccounts} unapprovedTransactions={unapprovedTransactions} />;
}
