import getEmployees from 'src/utils/services/employees/getEmployees';
import { getServerSession } from 'next-auth';
import { authOptions } from 'src/app/api/auth/[...nextauth]/route';
import EmployeeTabs from './components/EmployeeTabs';

export default async function page({ params }) {
  const employeeNumber = params.employee[0]?.match(/-(\d+)$/)?.[1];

  const [employee, session] = await Promise.all([getEmployees(employeeNumber), getServerSession(authOptions)]);
  return <EmployeeTabs employee={employee} user={session?.user} />;
}
