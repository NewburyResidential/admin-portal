import PropTypes from 'prop-types';
// @mui
import Box from '@mui/material/Box';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
import { useResponsive } from 'src/hooks/use-responsive';
// components
import { useSettingsContext } from 'src/components/display-settings';
//
import Main from './main';
import Header from './header';
import NavMini from './nav-mini';
import NavVertical from './nav-vertical';
import NavHorizontal from './nav-horizontal';

import { useSession } from 'next-auth/react';
import { authOptions } from 'src/app/api/auth/[...nextauth]/route';

// ----------------------------------------------------------------------

export default function DashboardLayout({ children }) {
  const { data: session } = useSession(authOptions);
  const settings = useSettingsContext();
  const currentUserRoles = session?.user?.roles || [];

  const lgUp = useResponsive('up', 'lg');

  const nav = useBoolean();

  const isHorizontal = settings.themeLayout === 'horizontal';

  const isMini = settings.themeLayout === 'mini';

  const renderNavMini = <NavMini currentUserRoles={currentUserRoles} />;

  const renderHorizontal = <NavHorizontal currentUserRoles={currentUserRoles} />;

  const renderNavVertical = <NavVertical openNav={nav.value} onCloseNav={nav.onFalse} currentUserRoles={currentUserRoles} />;

  if (isHorizontal) {
    return (
      <>
        <Header onOpenNav={nav.onTrue} session={session} />

        {lgUp ? renderHorizontal : renderNavVertical}

        <Main>{children}</Main>
      </>
    );
  }

  if (isMini) {
    return (
      <>
        <Header onOpenNav={nav.onTrue} session={session} />

        <Box
          sx={{
            minHeight: 1,
            display: 'flex',
            flexDirection: { xs: 'column', lg: 'row' },
          }}
        >
          {lgUp ? renderNavMini : renderNavVertical}

          <Main>{children}</Main>
        </Box>
      </>
    );
  }

  return (
    <>
      <Header onOpenNav={nav.onTrue} session={session} />

      <Box
        sx={{
          minHeight: 1,
          display: 'flex',
          flexDirection: { xs: 'column', lg: 'row' },
        }}
      >
        {renderNavVertical}

        <Main>{children}</Main>
      </Box>
    </>
  );
}

DashboardLayout.propTypes = {
  children: PropTypes.node,
};
