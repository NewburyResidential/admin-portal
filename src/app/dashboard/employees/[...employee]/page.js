import getEmployees from 'src/utils/services/employees/getEmployees';
import { getServerSession } from 'next-auth';
import { authOptions } from 'src/app/api/auth/[...nextauth]/route';
import EmployeeTabs from './components/EmployeeTabs';
import isAuthorizedToViewPage from 'src/layouts/dashboard/authorization/isAuthorizedToViewPage';
import { dashboardPaths } from 'src/routes/paths';

export default async function page({ params }) {
  const employeeNumber = params.employee[0]?.match(/-(\d+)$/)?.[1];

  const [employee, session] = await Promise.all([getEmployees(employeeNumber), getServerSession(authOptions)]);
  isAuthorizedToViewPage(session, dashboardPaths.employees.root);
  return <EmployeeTabs employee={employee} user={session?.user} />;
}
