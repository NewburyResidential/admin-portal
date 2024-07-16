import { useMemo } from 'react';
// routes
import { dashboardPaths, getOnboardingParameter, onboardingPaths, publicPaths } from 'src/routes/paths';
// components
import SvgColor from 'src/components/svg-color';
import { redirect } from 'next/navigation';
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

const icon = (icon) => (
  // <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
  // OR
  <Iconify icon={icon} sx={{ width: 1, height: 1 }} />
  // https://icon-sets.iconify.design/solar/
  // https://www.streamlinehq.com/icons
);

const ICONS = {
  dashboard: icon('material-symbols:dashboard'),
  employees: icon('clarity:employee-solid'),
  creditCard: icon('bi:credit-card-fill'),
  lowes: icon('bi:cart-fill'),
};

// ----------------------------------------------------------------------

export const isAuthorized = (session) => {
  const user = session?.user;
  if (!user) {
    redirect(publicPaths.login);
  }

  if (user.status !== '#AUTHORIZED') {
    redirect(publicPaths.unAuthorizedApplication(user.personalEmail));
  }

  if (user.isOnboarding) {
    //  redirect(`/onboarding/${getOnboardingParameter(user.name, user.pk)}`);
  }

  if (user?.roles.includes('admin')) return true;

  // const userHasAccess = navData.some((section) =>
  //   section.items.some(
  //     (item) =>
  //       (item.roles && item.roles.some((role) => user.roles.includes(role))) ||
  //       user.applications.includes(item.title) ||
  //       item.path === currentPath ||
  //       (item.children &&
  //         item.children.some(
  //           (child) => child.path === currentPath && (user.roles.includes(child.roles) || user.applications.includes(child.title))
  //         ))
  //   )
  // );

  return true;
};

export const roleOptions = [
  { value: 'admin', label: 'Admin' },
  { value: 'accounting', label: 'Accounting' },
  { value: 'hr', label: 'HR' },
  { value: 'manager', label: 'Manager' },
];
export function useNavData() {
  const data = useMemo(
    () => [
      // OVERVIEW---------------------------------------------------------------
      {
        subheader: 'Overview',
        items: [{ title: 'Dashboard', path: dashboardPaths.dashboard.root, icon: ICONS.dashboard }],
      },
      {
        subheader: 'Human Resource',
        items: [{ title: 'Employees', path: dashboardPaths.employees.root, icon: ICONS.employees }],
      },
      {
        subheader: 'Accounting',
        items: [
          {
            roles: ['accounting'],
            title: 'Expenses',
            path: dashboardPaths.creditCards.root,
            icon: ICONS.creditCard,
            children: [
              { title: 'Transactions', path: dashboardPaths.creditCards.root, roles: ['accounting'] }, // Create Root Folder
              { title: 'Reports', path: dashboardPaths.creditCards.reports, roles: ['accounting'] },
            ],
          },
          {
            title: 'Lowes',
            roles: ['accounting'],
            path: dashboardPaths.lowes.root,
            icon: ICONS.lowes,
          },
          // {
          //   title: 'Onboarding',
          //   roles: ['accounting'],
          //   path: onboardingPaths.root,
          //   icon: ICONS.tour,
          // },
        ],
      },
    ],
    []
  );

  return data;
}
