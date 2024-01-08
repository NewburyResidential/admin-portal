import { getServerSession } from 'next-auth';
import { revalidateTag } from 'next/cache';

import getVendorLocations from 'src/utils/services/entrata/getVendorLocations';
import getAllChartOfAccounts from 'src/utils/services/utility/getAllChartOfAccounts';
import getUnapprovedTransactions from 'src/utils/services/cc-expenses/getUnapprovedTransactions';

import Table from './components/Table';

export default async function page() {
  const [vendors, chartOfAccounts, unapprovedTransactions, { user }] = await Promise.all([
    getVendorLocations(),
    getAllChartOfAccounts(),
    getUnapprovedTransactions(),
    getServerSession(),
  ]);
  revalidateTag('transactions');
  unapprovedTransactions.sort((a, b) => {
    return new Date(a.transactionDate) - new Date(b.transactionDate);
  });

  const transactionsWithCheckedField = unapprovedTransactions.map((transaction) => ({
    ...transaction,
    checked: false,
  }));

  return <Table user={user} vendors={vendors} chartOfAccounts={chartOfAccounts} unapprovedTransactions={transactionsWithCheckedField} />;
}
