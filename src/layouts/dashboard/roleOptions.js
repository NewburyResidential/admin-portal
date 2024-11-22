//import { useNavData } from './config-navigation';
import { publicPaths, dashboardPaths } from 'src/routes/paths';
import { redirect } from 'next/navigation';
import { useMemo } from 'react';

export const roleOptions = [
  { value: 'public', label: 'Public' },
  { value: 'admin', label: 'Admin' },
  { value: 'accounting', label: 'Accounting' },
  { value: 'hr', label: 'HR' },
  // { value: 'manager', label: 'Manager' },
  { value: 'credit-card-assigner', label: 'Credit Card Assigner' },
  //Access to the credit card transactions
];

export const isAuthorized = (session, currentPath) => {
  const user = session?.user;
  if (!user) {
    redirect(publicPaths.login);
  }

  if (user.status !== '#AUTHORIZED') {
    redirect(publicPaths.unAuthorizedApplication(user.personalEmail));
  }

  // if (user.isOnboarding) {
  //  redirect(`/onboarding/${getOnboardingParameter(user.fullName, user.pk)}`);
  // }

  if (user?.roles.includes('admin')) return true;
  //  redirect(publicPaths.unAuthorizedApplication(user.personalEmail));

  const requiredRoles = getRolesForPath(navData, currentPath);

  if (requiredRoles.some((role) => user.roles.includes(role))) {
    console.log('authorized!!');
    return true;
  }
  console.log('not authorized!!');
  //redirect(publicPaths.unAuthorizedApplication(user.personalEmail));
  return false;
};

function getRolesForPath(navData, currentPath) {
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

  navData.forEach((section) => traverse(section.items));

  return roles;
}

const navData = [
  // OVERVIEW---------------------------------------------------------------
  {
    subheader: 'Overview',
    items: [
      // { title: 'Dashboard', path: dashboardPaths.dashboard.root, icon: ICONS.dashboard },
      { title: 'Resources', path: dashboardPaths.resources.root, roles: ['hr'] },
    ],
  },
  {
    subheader: 'Human Resource',
    items: [{ title: 'Employees', path: dashboardPaths.employees.root, roles: ['hr'] }],
  },
  {
    subheader: 'Accounting',
    items: [
      {
        roles: ['accounting'],
        title: 'Expenses',
        path: dashboardPaths.creditCards.root,
        children: [
          { title: 'Transactions', path: dashboardPaths.creditCards.root, roles: ['accounting'], icon: null }, // Create Root Folder
          { title: 'Reports', path: dashboardPaths.creditCards.reports, roles: ['accounting'], icon: null },
        ],
      },
      {
        title: 'Lowes',
        roles: ['accounting'],
        path: dashboardPaths.lowes.root,
      },
      // {
      //   title: 'Onboarding',
      //   roles: ['accounting'],
      //   path: onboardingPaths.root,
      //   icon: ICONS.tour,
      // },
    ],
  },
];

export const useRoleOptionsLookup = () => {
  const roleOptionsLookup = useMemo(() => {
    return roleOptions.reduce((acc, role) => {
      acc[role.value] = role.label;
      return acc;
    }, {});
  }, []);

  return roleOptionsLookup;
};
