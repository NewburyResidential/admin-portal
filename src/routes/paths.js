// ----------------------------------------------------------------------

const ROOTS = {
  AUTH: '/auth',
  DASHBOARD: '/dashboard',
};

// ----------------------------------------------------------------------

export const paths = {
  // AUTH
  auth: {
    jwt: {
      login: `${ROOTS.AUTH}/microsoft/login`,
      register: `${ROOTS.AUTH}/jwt/register`,
    },
  },
  // DASHBOARD - come back and rename
  dashboard: {
    root: ROOTS.DASHBOARD,
    one: `${ROOTS.DASHBOARD}/one`,
    group: {
      root: `${ROOTS.DASHBOARD}/group`,
      one: `${ROOTS.DASHBOARD}/group/one`,
      two: `${ROOTS.DASHBOARD}/group/two`,
    },
  },
  creditCards: {
    root: `${ROOTS.DASHBOARD}/credit-cards`,
    transactions: `${ROOTS.DASHBOARD}/credit-cards/transactions`,
    reports: `${ROOTS.DASHBOARD}/credit-cards/reports`,
  },
  utilities: {
    root: `${ROOTS.DASHBOARD}/utilities`,
  },
  payroll: {
    root: `${ROOTS.DASHBOARD}/payroll`,
  },

};

export const PATH_AFTER_LOGIN = paths.dashboard.root; // as '/dashboard'
