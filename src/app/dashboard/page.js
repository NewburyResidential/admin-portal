import { getServerSession } from 'next-auth';
import View from './components/View';
import TabOptions from './components/TabOptions';

export const metadata = {
  title: 'Dashboard',
};

export default async function Page() {
  const session = await getServerSession();

  return <TabOptions />;
}
