import { publicPaths, dashboardPaths } from 'src/routes/paths';
import { redirect } from 'next/navigation';
import { navConfiguration } from '../navConfiguration';

export default function isAuthorizedToViewPage(session, currentPath) {
  const user = session?.user;
  if (!user) {
    redirect(publicPaths.login);
  }

  if (user.status !== '#AUTHORIZED') {
    redirect(publicPaths.unAuthorizedApplication(user.personalEmail));
  }

  // if (user.isOnboarding) {
  //  redirect(`/onboarding/${getOnboardingParameter(user.name, user.pk)}`);
  // }

  if (user?.roles.includes('admin')) return true;

  const requiredRoles = getRolesForPath(navConfiguration, currentPath);

  if (requiredRoles.length === 0) {
    return true;
  }

  if (requiredRoles.some((role) => user.roles.includes(role))) {
    return true;
  } else {
    redirect(publicPaths.unAuthorizedApplication(user.personalEmail));
  }
}

function getRolesForPath(navConfiguration, currentPath) {
  let roles = [];

  const traverse = (items) => {
    items.forEach((item) => {
      if (item.path === currentPath) {
        roles = item.roles || [];
      }
      if (item.children) {
        traverse(item.children);
      }
    });
  };

  navConfiguration.forEach((section) => traverse(section.items));

  return roles;
}
