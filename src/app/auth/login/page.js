import { getServerSession } from 'next-auth';
import View from './components/View';

export default async function page(props) {
  const searchParams = await props.searchParams;
  const { callbackUrl } = searchParams;
  const session = await getServerSession();
  return <View session={session} params={callbackUrl} />;
}
