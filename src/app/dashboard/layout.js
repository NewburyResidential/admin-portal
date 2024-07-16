'use client';

import PropTypes from 'prop-types';
 import { SnackbarProvider } from 'src/utils/providers/SnackbarProvider';

// components
import DashboardLayout from 'src/layouts/dashboard';

// ----------------------------------------------------------------------

export default function Layout({ children }) {
  return (
     <SnackbarProvider>
      <DashboardLayout>{children}</DashboardLayout>
     </SnackbarProvider>
  );
}

Layout.propTypes = {
  children: PropTypes.node,
};
