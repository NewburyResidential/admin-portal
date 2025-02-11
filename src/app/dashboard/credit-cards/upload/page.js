import FileInput from './components/FileInput';
import { authOptions } from 'src/app/api/auth/[...nextauth]/route';
import { getServerSession } from 'next-auth';
import { getAllEmployees } from 'src/utils/services/employees/getAllEmployees';
import getAllChartOfAccounts from 'src/utils/services/utility/getAllChartOfAccounts';

export default async function page() {
  const [session, employees, chartOfAccounts] = await Promise.all([getServerSession(authOptions), getAllEmployees(), getAllChartOfAccounts()]);
  return <FileInput employees={employees} user={session?.user} chartOfAccounts={chartOfAccounts} />;
}
