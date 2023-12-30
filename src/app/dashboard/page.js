import { getServerSession } from 'next-auth';
import View from './components/View';

export const metadata = {
  title: 'Dashboard',
};

export default async function Page() {
  const session = await getServerSession();

  return <View user={session?.user} />;
}
