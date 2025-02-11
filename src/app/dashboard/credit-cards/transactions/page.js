import { getServerSession } from 'next-auth';

import getVendorLocations from 'src/utils/services/entrata/getVendorLocations';
import getAllChartOfAccounts from 'src/utils/services/utility/getAllChartOfAccounts';
import getSuggestedReceipts from 'src/utils/services/cc-expenses/getSuggestedReceipts';
import { authOptions } from 'src/app/api/auth/[...nextauth]/route';
import isAuthorizedToViewPage from 'src/layouts/dashboard/authorization/isAuthorizedToViewPage';
import { dashboardPaths } from 'src/routes/paths';
import { getCreditCardAccounts } from 'src/utils/services/cc-expenses/getCreditCardAccounts';
import { getAllEmployees } from 'src/utils/services/employees/getAllEmployees';
import TransactionList from '../components/CreditCard/TransactionList';
import updateAccountsWithEmployees from '../components/utils/update-accounts-with-employees';
import { getUnapprovedTransactionsWithReceipts } from 'src/utils/services/cc-expenses/getUnapprovedTransactionsWithReceipts';

export default async function page() {
  const [vendors, chartOfAccounts, suggestedReceipts, session, creditCardAccounts, employees, unapprovedTransactions] = await Promise.all([
    getVendorLocations(),
    getAllChartOfAccounts(),
    getSuggestedReceipts(),
    getServerSession(authOptions),
    getCreditCardAccounts(),
    getAllEmployees(),
    getUnapprovedTransactionsWithReceipts(),
  ]);

  isAuthorizedToViewPage(session, dashboardPaths.creditCards.root);

  const creditCardAccountsWithEmployees = updateAccountsWithEmployees(creditCardAccounts, employees);

  return (
    <TransactionList
      employees={employees}
      unapprovedTransactions={unapprovedTransactions}
      user={session?.user}
      creditCardAccountsWithEmployees={creditCardAccountsWithEmployees}
      creditCardAccounts={creditCardAccounts}
      chartOfAccounts={chartOfAccounts}
      vendorData={vendors}
      suggestedReceipts={suggestedReceipts}
    />
  );
}
