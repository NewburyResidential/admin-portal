import { useMemo } from 'react';
// routes
import { paths } from 'src/routes/paths';
// components
import SvgColor from 'src/components/svg-color';

const DASHBOARD = '/dashboard';

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

export function useNavData() {
  const data = useMemo(
    () => [
      // OVERVIEW---------------------------------------------------------------
      {
        subheader: 'Overview',
        items: [{ title: 'Dashboard', path: paths.dashboard.root, icon: ICONS.dashboard }],
      },

      // MANAGEMENT-------------------------------------------------------------

      // {
      //   subheader: 'Utility Management',
      //   items: [
      //     {
      //       title: 'Billing',
      //       path: paths.dashboard.group.root,
      //       icon: ICONS.user,
      //       children: [
      //         { title: '2138 Springport', path: paths.dashboard.group.one },
      //         { title: '380 Union', path: paths.dashboard.group.two },
      //       ],
      //     },
      //   ],
      // },
      {
        subheader: 'Accounting',
        items: [
          {
            title: 'Expenses',
            path: paths.creditCards.root,
            icon: ICONS.banking,
            children: [
              { title: 'Transactions', path: paths.creditCards.root }, // Create Root Folder
              { title: 'Reports', path: paths.creditCards.reports },
            ],
          },
          {
            title: 'Lowes',
            path: `${DASHBOARD}/lowes`,
            icon: ICONS.order,
          },
        ],
      },
    ],
    []
  );

  return data;
}
