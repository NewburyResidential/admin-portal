'use client';

import Stack from '@mui/material/Stack';
import LoginView from './Login';

export default function View() {
  return (
    <Stack
      flexGrow={1}
      spacing={10}
      alignItems="center"
      justifyContent="center"
      sx={{
        height: '100vh',
        width: '100%',
        backgroundColor:(theme) => theme.palette.mode === 'light' ? '#F5F5F5' : 'grey.900',
      }}
    >
      <LoginView />
    </Stack>
  );
}
