import getAllChartOfAccounts from 'src/utils/services/utility/getAllChartOfAccounts';
import Steps from './components/Steps';
import { getServerSession } from 'next-auth';
import { authOptions } from 'src/app/api/auth/[...nextauth]/route';
import isAuthorizedToViewPage from 'src/layouts/dashboard/authorization/isAuthorizedToViewPage';
import { dashboardPaths } from 'src/routes/paths';

export default async function page() {
  const [chartOfAccounts, session] = await Promise.all([getAllChartOfAccounts(), getServerSession(authOptions)]);
  isAuthorizedToViewPage(session, dashboardPaths.lowes.root);

  return (
    <div>
      <Steps chartOfAccounts={chartOfAccounts} />
    </div>
  );
}
