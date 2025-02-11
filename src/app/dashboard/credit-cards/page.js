import { getServerSession } from 'next-auth';

import { authOptions } from 'src/app/api/auth/[...nextauth]/route';
import { dashboardPaths } from 'src/routes/paths';

import { redirect } from 'next/navigation';

export default async function page() {
  const [session] = await Promise.all([getServerSession(authOptions)]);
  const userRoles = session?.user?.roles;
  const isCreditCardAssigner = userRoles?.includes('credit-card-assigner');

  if (isCreditCardAssigner) {
    redirect(dashboardPaths.creditCards.transactions);
  } else {
    redirect(dashboardPaths.creditCards.upload);
  }
}
