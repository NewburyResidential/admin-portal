import getEmployees from 'src/utils/services/employees/getEmployees';
import { getServerSession } from 'next-auth';
import { authOptions } from 'src/app/api/auth/[...nextauth]/route';
import EmployeeTabs from './components/EmployeeTabs';
import isAuthorizedToViewPage from 'src/layouts/dashboard/authorization/isAuthorizedToViewPage';
import { dashboardPaths } from 'src/routes/paths';
import getNewburyAssets from 'src/utils/services/newbury/get-assets';
import { getAllEmployees } from 'src/utils/services/employees/getAllEmployees';

export default async function page(props) {
  const params = await props.params;
  let employeeNumber;
  // check if there is a number in the params
  if (params.employee[0] && /\d/.test(params.employee[0])) {
    employeeNumber = params.employee[0]?.match(/-(\d+)$/)?.[1];
  } else {
    employeeNumber = params.employee[0];
  }

  const [employee, employees, session, newburyAssets] = await Promise.all([
    getEmployees(employeeNumber),
    getAllEmployees(),
    getServerSession(authOptions),
    getNewburyAssets(),
  ]);
  isAuthorizedToViewPage(session, dashboardPaths.employees.root);
  return <EmployeeTabs employee={employee} user={session?.user} newburyAssets={newburyAssets} employees={employees} />;
}
