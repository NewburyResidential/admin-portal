import { getServerSession } from 'next-auth';
import { authOptions } from 'src/app/api/auth/[...nextauth]/route';
import View from './components/View';
import { dashboardPaths } from 'src/routes/paths';
import isAuthorizedToViewPage from 'src/layouts/dashboard/authorization/isAuthorizedToViewPage';
import isAuthorizedToViewContent from 'src/layouts/dashboard/authorization/isAuthorizedToViewContent';
import getResources from 'src/utils/services/intranet/get-resources';

export const metadata = {
  title: 'Resources',
};

export default async function Page() {
  const [rawResourcesResponse, session] = await Promise.all([getResources(), getServerSession(authOptions)]);
  isAuthorizedToViewPage(session, dashboardPaths.resources.root);
  const rawResources = rawResourcesResponse.data || [];

  const resourcesObject = {};
  const currentSessionRoles = session?.user?.roles || [];

  rawResources.forEach((resource) => {
    if (isAuthorizedToViewContent(resource.roles, currentSessionRoles)) {
      const { resourceType } = resource;
      if (!resourcesObject[resourceType]) {
        resourcesObject[resourceType] = [];
      }
      resourcesObject[resourceType].push(resource);
    }
  });

  return <View resourcesObject={resourcesObject} session={session} />;
}
