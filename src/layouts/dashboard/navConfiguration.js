import { dashboardPaths } from 'src/routes/paths';

export const ICONS = {
  dashboard: 'material-symbols:dashboard',
  employees: 'clarity:employee-solid',
  creditCard: 'bi:credit-card-fill',
  lowes: 'bi:cart-fill',
  resources: 'bi:file-earmark-text-fill',
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
        roles: ['accounting', 'credit-card-assigner'],
        title: 'Expenses',
        path: dashboardPaths.creditCards.root,
        icon: ICONS.creditCard,
        children: [
          { title: 'Transactions', path: dashboardPaths.creditCards.root, roles: ['credit-card-assigner'] }, // Create Root Folder
          { title: 'Reports', path: dashboardPaths.creditCards.reports, roles: ['accounting'] },
        ],
      },
      {
        title: 'Lowes',
        roles: ['admin'],
        path: dashboardPaths.lowes.root,
        icon: ICONS.lowes,
      },
    ],
  },
];
