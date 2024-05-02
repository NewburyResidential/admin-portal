import { getServerSession } from 'next-auth';
import View from './components/View';
import TabOptions from './components/TabOptions';
import getResources from 'src/utils/services/intranet/getResources';

export const metadata = {
  title: 'Dashboard',
};

export default async function Page() {
  const [resources, { user }] = await Promise.all([
    getResources(),
    getServerSession(),
  ]);

  return <TabOptions resources={resources} user={user} />;
}
