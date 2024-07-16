//TO DO remove needing to add route

// Follow this layout to create a new path
// Example: dashboardPaths.creditCard for root path or dashboardPaths.creditCard.transactions for sub path
const rawDashboardPaths = {
  dashboard: {
    root: '/',
  },

  creditCards: {
    root: `/credit-cards`,
    sub: {
      transactions: `/transactions`,
      reports: `/reports`,
    },
  },

  employees: {
    root: `/employees`,
  },

  lowes: {
    root: `/lowes`,
    sub: {},
  },
};

export const onboardingPaths = {
  root: '/onboarding',
  employee: (name, pk) => `/${getOnboardingParameter(name, pk)}`,
};

export const publicPaths = {
  logout: '/auth/logout',
  login: '/auth/login',
  loginVerify: '/auth/verify',
  unAuthorizedLogin: (email) => `auth/unauthorized/login?email=${email}`,
  unAuthorizedApplication: (email) => `auth/unauthorized/application/?email=${email}`,
};

export const dashboardPaths = adjustPaths(rawDashboardPaths);

function adjustPaths(paths) {
  const result = {};

  for (const key in paths) {
    if (Object.prototype.hasOwnProperty.call(paths, key)) {
      const { root, sub } = paths[key];
      const fullRoot = `/dashboard${root}`;
      result[key] = { root: fullRoot };

      for (const subKey in sub) {
        if (Object.prototype.hasOwnProperty.call(sub, subKey)) {
          result[key][subKey] = `${fullRoot}${sub[subKey]}`;
        }
      }
    }
  }

  return result;
}

export function getOnboardingParameter(name, pk) {
  const formattedName = name.replace(/ /g, '_').toLowerCase();
  return `${formattedName}-${pk}`;
}
