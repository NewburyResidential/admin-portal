import { getServerSession } from 'next-auth';
import { authOptions } from 'src/app/api/auth/[...nextauth]/route';
import { NotFoundView } from 'src/components/error';
import View from './components/View';
import isAuthorizedToViewContent from 'src/layouts/dashboard/authorization/isAuthorizedToViewContent';
import getResources from 'src/utils/services/intranet/get-resources';

export const metadata = {
  title: 'Newbury Resources',
};

export default async function Page(props) {
  const params = await props.params;
  const [rawResourcesResponse, session] = await Promise.all([getResources(), getServerSession(authOptions)]);
  const rawResources = rawResourcesResponse.data || [];
  const resourceLabel = params?.resourceGroup[0] || null;
  const decodedLabel = decodeURIComponent(resourceLabel);
  const formattedLabel = decodedLabel.replace(/_/g, ' ').toLowerCase();
  const resourceGroup = rawResources.find((resource) => resource?.label?.toLowerCase() === formattedLabel);
  const resourceGroupId = resourceGroup?.pk || null;
  if (!resourceGroupId) {
    return <NotFoundView />;
  }

  const categories = {};
  const resourcesByGroup = {};
  const currentSessionRoles = session?.user?.roles || [];

  rawResources.forEach((resource) => {
    if (isAuthorizedToViewContent(resource.roles, currentSessionRoles)) {
      if (resource.group === resourceGroupId) {
        if (resource.resourceType === 'resourceCategories') {
          categories[resource.pk] = { ...resource, resources: [] };
        } else if (resource.resourceType === 'resources') {
          (resourcesByGroup[resource.category] ||= []).push(resource);
        }
      }
    }
  });

  for (const [categoryPk, resources] of Object.entries(resourcesByGroup)) {
    if (categories[categoryPk]) {
      categories[categoryPk].resources = resources;
    }
  }
  const categoryOptions = Object.keys(categories).reduce((acc, key) => {
    acc[key] = categories[key].label;
    return acc;
  }, {});

  return (
    <View categories={Object.values(categories)} user={session?.user} resourceGroup={resourceGroup} categoryOptions={categoryOptions} />
  );
}
