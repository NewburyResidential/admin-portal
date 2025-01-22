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
    const email = session?.user?.workEmail || session?.user?.personalEmail || 'No email found';
    const roles = session?.user?.roles || ['no roles found'];
    Sentry.setUser({ email, roles });
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
