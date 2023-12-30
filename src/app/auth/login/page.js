import { getServerSession } from 'next-auth';
import View from './components/View';

export default async function page({ searchParams }) {
  const { callbackUrl } = searchParams;
  const session = await getServerSession();
  return <View session={session} params={callbackUrl} />;
}
