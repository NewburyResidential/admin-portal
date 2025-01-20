import axios from 'axios';
import getPaylocityAccessToken from './get-paylocity-access-token';

export default async function updateWorkEmail(employeeId, emailAddress) {
  try {
    const accessToken = await getPaylocityAccessToken();

    const response = await axios({
      method: 'PATCH',
      url: `https://api.paylocity.com/api/v2/companies/319245/employees/${employeeId}`,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      validateStatus: (status) => true,

      data: {
        workAddress: { emailAddress },
      },
    });

    return response;
  } catch (error) {
    throw new Error('Failed to update work email in Paylocity');
  }
}
