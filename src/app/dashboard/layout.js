'use client';

import * as Sentry from '@sentry/nextjs';
import PropTypes from 'prop-types';
import { SnackbarProvider } from 'src/utils/providers/SnackbarProvider';
import { useSession } from 'next-auth/react';
import { authOptions } from 'src/app/api/auth/[...nextauth]/route';

// components
import DashboardLayout from 'src/layouts/dashboard';

// ----------------------------------------------------------------------

export default function Layout({ children }) {
  const { data: session } = useSession(authOptions);

  if (session) {
    Sentry.setUser({ email: 'john.doe@example.com', roles: ['user', 'other'] });
  }

  return (
    <SnackbarProvider session={session}>
      <DashboardLayout session={session}>{children}</DashboardLayout>
    </SnackbarProvider>
  );
}

Layout.propTypes = {
  children: PropTypes.node,
};
