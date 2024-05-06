import { getServerSession } from 'next-auth';
import getResources from 'src/utils/services/intranet/getResources';
import ResourceGroupView from '../../components/Information/ResourceGroupView';
import { NotFoundView } from 'src/components/error';

export const metadata = {
  title: 'Newbury Resources',
};

export default async function Page({ params }) {
  const [rawResources, { user }] = await Promise.all([getResources(), getServerSession()]);
  const resourceLabel = params?.resourceGroup[0] || null;
  const decodedLabel = decodeURIComponent(resourceLabel);
  const formattedLabel = decodedLabel.replace(/_/g, ' ').toLowerCase();
  const resourceGroup = rawResources.find((resource) => resource.label.toLowerCase() === formattedLabel);
  const resourceGroupId = resourceGroup?.pk || null;
  if (!resourceGroupId) {
    return  <NotFoundView />;
  }
  console.log(resourceGroup);

  const categories = {};
  const resourcesByGroup = {};

  rawResources.forEach((resource) => {
    if (resource.group === resourceGroupId) {
      if (resource.resourceType === 'resourceCategories') {
        categories[resource.pk] = { ...resource, resources: [] };
      } else if (resource.resourceType === 'resources') {
        (resourcesByGroup[resource.category] ||= []).push(resource);
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
    <ResourceGroupView categories={Object.values(categories)} user={user} resourceGroup={resourceGroup} categoryOptions={categoryOptions} />
  );
}
