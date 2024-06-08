'use client';

import { useState } from 'react';

import Stack from '@mui/material/Stack';

import NotAuthorizedView from './NotAuthorized';
import RequestAccessView from './RequestAccess';

export default function UnauthorizedView({ type }) {
  const [screen, setScreen] = useState('not-authorized');

  return (
    <Stack
      flexGrow={1}
      spacing={10}
      alignItems="center"
      justifyContent="center"
      sx={{
        height: '100vh',
        width: '100%',
        background: 'radial-gradient(circle, rgba(255, 255, 255, 0.92), rgba(235, 235, 235, 0.9))',
      }}
    >
      {screen === 'not-authorized' && <NotAuthorizedView setScreen={setScreen} type={type} />}
      {screen === 'request-access' && <RequestAccessView type={type} />}
    </Stack>
  );
}
