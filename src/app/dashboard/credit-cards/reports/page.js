import isAuthorizedToViewPage from 'src/layouts/dashboard/authorization/isAuthorizedToViewPage';
import View from './components/View';
import { getServerSession } from 'next-auth';
import { authOptions } from 'src/app/api/auth/[...nextauth]/route';
import { dashboardPaths } from 'src/routes/paths';

export default async function page() {
  const session = await getServerSession(authOptions);

  isAuthorizedToViewPage(session, dashboardPaths.creditCards.reports);
  return <View />;
}
