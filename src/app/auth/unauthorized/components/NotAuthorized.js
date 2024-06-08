import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { LoadingButton } from '@mui/lab';

import { sendRequestAccess } from 'src/utils/services/login/send-request-access';

export default function NotAuthorizedView({ setScreen, type }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  const decodedEmail = decodeURIComponent(email);

  const handleRequestAccess = async () => {
    setLoading(true);
    await sendRequestAccess({ email: decodedEmail });
    setScreen('request-access');
  };
  return (
    <Card sx={{ maxWidth: 500, width: '100%', p: 3 }}>
      <CardContent>
        <Typography variant="h4" align="center" gutterBottom>
          Not Authorized
        </Typography>
        {type === 'login' ? (
          <Typography variant="body1" align="center" gutterBottom sx={{ mt: 3 }}>
            Your email is not authorized to access this portal. Verify you have used the correct login. Otherwise, please request access
            below
          </Typography>
        ) : (
          <Typography variant="body1" align="center" gutterBottom sx={{ mt: 3 }}>
            Your profile is not authorized to access this part of the portal. Please request access below
          </Typography>
        )}

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            mt: 5,
          }}
        >
          <Stack spacing={2.5} sx={{ width: '100%' }}>
            <LoadingButton
              loading={loading}
              sx={{ height: '44px' }}
              variant="contained"
              type="submit"
              fullWidth
              onClick={handleRequestAccess}
            >
              Request Access
            </LoadingButton>
            <Button
              sx={{ height: '44px' }}
              variant="outlined"
              type="submit"
              fullWidth
              onClick={() => {
                if (type === 'login') {
                  router.push('/auth/login');
                } else {
                  router.push('/dashboard/');
                }
              }}
            >
              {type === 'login' ? 'Try A Different Login' : 'Go Home'}
            </Button>
          </Stack>
        </Box>
      </CardContent>
    </Card>
  );
}
