import { getServerSession } from 'next-auth';
import { authOptions } from 'src/app/api/auth/[...nextauth]/route';
//import { isAuthorized } from 'src/layouts/dashboard/config-navigation';

import TabOptions from './components/TabOptions';
import getResources from 'src/utils/services/intranet/getResources';

export const metadata = {
  title: 'Dashboard',
};

export default async function Page() {
  const [rawResources, session] = await Promise.all([
    getResources(),
    getServerSession(authOptions),
   // getAllEmployees('employees'),
  ]);

  //isAuthorized(session);

  const resourcesObject = {};

  rawResources.forEach((resource) => {
    const { resourceType } = resource;
    if (!resourcesObject[resourceType]) {
      resourcesObject[resourceType] = [];
    }
    resourcesObject[resourceType].push(resource);
  });

  return <TabOptions resourcesObject={resourcesObject} session={session} />;
}
