import { useMemo } from 'react';
// routes
import { dashboardPaths, getOnboardingParameter, onboardingPaths, publicPaths } from 'src/routes/paths';
// components
import SvgColor from 'src/components/svg-color';
import { redirect } from 'next/navigation';

// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
  // OR
  // <Iconify icon="fluent:mail-24-filled" />
  // https://icon-sets.iconify.design/solar/
  // https://www.streamlinehq.com/icons
);

const ICONS = {
  job: icon('ic_job'),
  blog: icon('ic_blog'),
  chat: icon('ic_chat'),
  mail: icon('ic_mail'),
  user: icon('ic_user'),
  file: icon('ic_file'),
  lock: icon('ic_lock'),
  tour: icon('ic_tour'),
  order: icon('ic_order'),
  label: icon('ic_label'),
  blank: icon('ic_blank'),
  kanban: icon('ic_kanban'),
  folder: icon('ic_folder'),
  banking: icon('ic_banking'),
  booking: icon('ic_booking'),
  invoice: icon('ic_invoice'),
  product: icon('ic_product'),
  calendar: icon('ic_calendar'),
  disabled: icon('ic_disabled'),
  external: icon('ic_external'),
  menuItem: icon('ic_menu_item'),
  ecommerce: icon('ic_ecommerce'),
  analytics: icon('ic_analytics'),
  dashboard: icon('ic_dashboard'),
};

// ----------------------------------------------------------------------

export const isAuthorized = (session, currentPath) => {
  console.log('session:', session);
  const user = session?.user;
  if (!user) {
    redirect(publicPaths.unAuthorizedApplication('No-Session-Registed'));
  }

  if (user.status !== '#AUTHORIZED') {
    redirect(publicPaths.unAuthorizedApplication(user.personalEmail));
  }

  if (user.isOnboarding) {
    redirect(`/onboarding?employee=${getOnboardingParameter(user.name, user.pk)}`);
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
export function useNavData() {
  const data = useMemo(
    () => [
      // OVERVIEW---------------------------------------------------------------
      {
        subheader: 'Overview',
        items: [{ title: 'Dashboard', path: dashboardPaths.dashboard.root, icon: ICONS.dashboard }],
      },
      {
        subheader: 'Accounting',
        items: [
          {
            roles: ['accounting'],
            title: 'Expenses',
            path: dashboardPaths.creditCards.root,
            icon: ICONS.banking,
            children: [
              { title: 'Transactions', path: dashboardPaths.creditCards.root, roles: ['accounting'] }, // Create Root Folder
              { title: 'Reports', path: dashboardPaths.creditCards.reports, roles: ['accounting'] },
            ],
          },
          {
            title: 'Lowes',
            roles: ['accounting'],
            path: dashboardPaths.lowes.root,
            icon: ICONS.order,
          },
          {
            title: 'Onboarding',
            roles: ['accounting'],
            path: onboardingPaths.root,
            icon: ICONS.tour,
          },
        ],
      },
    ],
    []
  );

  return data;
}
