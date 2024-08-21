import { getAllEmployees } from 'src/utils/services/employees/getAllEmployees';
import UserList from './components/UserList';
import isAuthorizedToViewPage from 'src/layouts/dashboard/authorization/isAuthorizedToViewPage';
import { dashboardPaths } from 'src/routes/paths';
import { getServerSession } from 'next-auth';
import { authOptions } from 'src/app/api/auth/[...nextauth]/route';

export default async function page() {
  const [employees, session] = await Promise.all([getAllEmployees('employees'), getServerSession(authOptions)]);
  isAuthorizedToViewPage(session, dashboardPaths.employees.root);
  return <UserList employees={employees} />;
}
