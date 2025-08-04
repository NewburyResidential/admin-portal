import { dashboardPaths } from 'src/routes/paths';

export const ICONS = {
  dashboard: 'material-symbols:dashboard',
  employees: 'clarity:employee-solid',
  creditCard: 'bi:credit-card-fill',
  lowes: 'bi:cart-fill',
  resources: 'bi:file-earmark-text-fill',
  payroll: 'material-symbols:payments-outline',
  sherwinWilliams: 'material-symbols:format-paint',
  utilities: 'material-symbols:water-drop',
};

// roles should be included in main group if different roles are required for children
export const navConfiguration = [
  {
    subheader: 'Overview',
    items: [{ title: 'Resources', path: dashboardPaths.resources.root, icon: ICONS.resources, forceDeepActive: true }],
  },
  {
    subheader: 'Human Resource',
    items: [{ title: 'Employees', path: dashboardPaths.employees.root, icon: ICONS.employees, roles: ['hr'], forceDeepActive: true }],
  },
  {
    subheader: 'Accounting',
    items: [
      {
        title: 'P-Card',
        path: dashboardPaths.creditCards.root,
        icon: ICONS.creditCard,
        children: [
          { title: 'Upload Receipts', path: dashboardPaths.creditCards.upload },
          { title: 'Transactions', path: dashboardPaths.creditCards.transactions, roles: ['credit-card-assigner'] }, // Create Root Folder
          { title: 'Reports', path: dashboardPaths.creditCards.reports, roles: ['accounting'] },
        ],
      },
      {
        title: 'Lowes',
        roles: ['admin'],
        path: dashboardPaths.lowes.root,
        icon: ICONS.lowes,
      },
      {
        title: 'Payroll',
        roles: ['admin'],
        path: dashboardPaths.payroll.root,
        icon: ICONS.payroll,
      },
      {
        title: 'Sherwin',
        roles: ['admin'],
        path: dashboardPaths.sherwinWilliams.root,
        icon: ICONS.sherwinWilliams,
      },
      {
        title: 'Utilities',
        roles: ['admin'],
        path: dashboardPaths.utilities.root,
        icon: ICONS.utilities,
      },
    ],
  },
];
