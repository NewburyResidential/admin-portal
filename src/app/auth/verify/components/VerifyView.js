'use client';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { useRouter } from 'next/navigation';

export default function VerifyView() {
  const router = useRouter();
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
      <Card sx={{ maxWidth: 500, width: '100%', p: 3 }}>
        <CardContent>
          <Typography variant="h4" align="center" gutterBottom>
            Check Your Email
          </Typography>
          <Typography variant="body1" align="center" gutterBottom sx={{ mt: 3 }}>
            We&aptos;ve sent a login link to your email. Please follow the email link to access this protal. You may close this window
          </Typography>
        </CardContent>
        <Button
          onClick={() => {
            router.push('/auth/login');
          }}
          variant="contained"
          sx={{ height: '44px', mt: 1 }}
          fullWidth
        >
          Resend Email verification
        </Button>
      </Card>
    </Stack>
  );
}
