import { publicPaths } from 'src/routes/paths';
import { redirect } from 'next/navigation';
import { navConfiguration } from '../navConfiguration';

export default function isAuthorizedToViewPage(session, currentPath) {
  const user = session?.user;
  if (!user) {
    redirect(publicPaths.login);
  }

  if (user.status !== '#AUTHORIZED') {
    redirect(publicPaths.unAuthorizedApplication(user.personalEmail, currentPath));
  }

  // if (user.isOnboarding) {
  //  redirect(`/onboarding/${getOnboardingParameter(user.fullName, user.pk)}`);
  // }

  if (user?.roles.includes('admin')) return true;

  const requiredRoles = getRolesForPath(currentPath);
  console.log('requiredRoles', requiredRoles);
  console.log(currentPath);

  if (requiredRoles.length === 0) {
    return true;
  }

  if (requiredRoles.some((role) => user.roles.includes(role))) {
    return true;
  }
  redirect(publicPaths.unAuthorizedApplication(user.personalEmail));
  return false;
}

function getRolesForPath(currentPath) {
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
