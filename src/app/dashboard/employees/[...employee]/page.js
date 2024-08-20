import getEmployees from 'src/utils/services/employees/getEmployees';
import { getServerSession } from 'next-auth';
import { authOptions } from 'src/app/api/auth/[...nextauth]/route';
import EmployeeTabs from './components/EmployeeTabs';

export default async function page() {
  const [employee, session] = await Promise.all([getEmployees('18'), getServerSession(authOptions)]);

  return <EmployeeTabs employee={employee} user={session?.user} />;
}
