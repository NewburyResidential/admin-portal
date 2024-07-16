import { getAllEmployees } from 'src/utils/services/employees/getAllEmployees';
import UserList from './components/Employees/UserList';

export default async function page() {
  const employees = await getAllEmployees('employees');
  return <UserList employees={employees} />;
}
