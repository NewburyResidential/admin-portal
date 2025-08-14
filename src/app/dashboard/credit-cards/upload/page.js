import FileInput from './components/FileInput';
import { authOptions } from 'src/app/api/auth/[...nextauth]/route';
import { getServerSession } from 'next-auth';
import { getAllEmployees } from 'src/utils/services/employees/getAllEmployees';
import getAllChartOfAccounts from 'src/utils/services/utility/getAllChartOfAccounts';
import getNewburyAssets from 'src/utils/services/newbury/get-assets';

export default async function page() {
  const [session, employees, chartOfAccounts, newburyAssets] = await Promise.all([getServerSession(authOptions), getAllEmployees(), getAllChartOfAccounts(), getNewburyAssets()]);

  return <FileInput employees={employees} user={session?.user} chartOfAccounts={chartOfAccounts} newburyAssets={newburyAssets} />;
}
