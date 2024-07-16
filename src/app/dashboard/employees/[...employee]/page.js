import getEmployee from 'src/utils/services/employees/getEmployee';
import UserPage from '../../components/Employees/employee/Profile';
import getEmployees from 'src/utils/services/employees/getEmployees';

export const revalidate = 0;

const url = 'https://0yxexcpp8f.execute-api.us-east-1.amazonaws.com/unapprovedTransactions';
const requestOptions = {
  //cache: 'no-cache',
  next: { revalidate: 0 },
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
  },
};

export default async function page() {
  const employee = await getEmployees('18');


  return <UserPage employee={employee} />;
}
