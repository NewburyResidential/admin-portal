import { getServerSession } from 'next-auth';
import { authOptions } from 'src/app/api/auth/[...nextauth]/route';
import isAuthorizedToViewPage from 'src/layouts/dashboard/authorization/isAuthorizedToViewPage';
import { dashboardPaths } from 'src/routes/paths';
import getUsageBillsByMonth from 'src/utils/services/utilities/get-usage-bills-by-month';
import View from './components/View';
import getAllUtilityMeterAccounts from 'src/utils/services/utilities/get-all-utility-meter-accounts';

export default async function page() {
  const [session, usageBills1, usageBills2, usageBills3, utilityMeterAccounts] = await Promise.all([
    getServerSession(authOptions),
    getUsageBillsByMonth('07/2025'),
    getUsageBillsByMonth('08/2025'),
    getUsageBillsByMonth('06/2025'),
    getAllUtilityMeterAccounts(),
  ]);
  isAuthorizedToViewPage(session, dashboardPaths.utilities); //TODO change to usage
  const usageBills = [...usageBills1, ...usageBills2, ...usageBills3];

  return (
    <div>
      <View usageBills={usageBills} utilityMeterAccounts={utilityMeterAccounts} />
    </div>
  );
}
