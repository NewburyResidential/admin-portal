import { getServerSession } from 'next-auth';
import TabOptions from './components/TabOptions';
import getResources from 'src/utils/services/intranet/getResources';

export const metadata = {
  title: 'Dashboard',
};

export default async function Page() {
  const [rawResources, { user }] = await Promise.all([getResources(), getServerSession()]);

  const resourcesObject = {};

  rawResources.forEach((resource) => {
    const { resourceType } = resource;
    if (!resourcesObject[resourceType]) {
      resourcesObject[resourceType] = [];
    }
    resourcesObject[resourceType].push(resource);
  });

  return <TabOptions resourcesObject={resourcesObject} user={user} />;
}
