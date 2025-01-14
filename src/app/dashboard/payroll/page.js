import getAssets from 'src/utils/services/newbury/get-assets';
import PayrollView from './components/PayrollView';
import { authOptions } from 'src/app/api/auth/[...nextauth]/route';
import { dashboardPaths } from 'src/routes/paths';
import isAuthorizedToViewPage from 'src/layouts/dashboard/authorization/isAuthorizedToViewPage';
import { getServerSession } from 'next-auth';

const Payroll = async () => {
  const [assets, session] = await Promise.all([getAssets(), getServerSession(authOptions)]);

  isAuthorizedToViewPage(session, dashboardPaths.payroll.root);

  return <PayrollView assets={assets} />;
};

export default Payroll;
