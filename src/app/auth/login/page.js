import Login from 'src/components/auth/Login';
import { headers } from 'next/headers';

export default async function page({ searchParams }) {
  const headersList = headers();
  const domain = headersList.get('host') || null;
  const fullUrl = headersList.get('referer') || null;
  const protocol = fullUrl.match(/^https?:\/\//)[0];
  const origin = `${protocol}${domain}`;

  const redirectedFrom = searchParams?.redirectedFrom || '/dashboard';

  return <Login origin={origin} redirectPath={redirectedFrom} />;
}
