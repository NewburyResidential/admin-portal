'use client';

// @mui
import { useState } from 'react';
import Box from '@mui/material/Box';

import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';

import { signIn } from 'next-auth/react';

import * as yup from 'yup';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { getAuthorizedUserByEmail } from 'src/utils/services/employees/getAuthorizedUserByEmail';
import { useResponsive } from 'src/hooks/use-responsive';

const schema = yup.object().shape({
  email: yup.string().email('Please Enter A valid email').required('Please Enter A valid email'),
});

export default function LoginView({ params }) {
  const isLaptop = useResponsive('up', 'lg');
  const [loading, setLoading] = useState(false);
  const callbackUrl = params || '/dashboard';
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: '',
    },
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    const email = data.email.toLowerCase();
    setLoading(true);
    const employee = await getAuthorizedUserByEmail(data.email);
    if (employee) {
      const hasWorkEmail =
        employee?.workEmail && employee?.workEmail !== 'null' && employee?.workEmail !== 'undefined' && employee?.workEmail !== '';
      if (hasWorkEmail) {
        signIn('azure-ad', { email, callbackUrl });
      } else {
        signIn('aws-email', { email, callbackUrl });
      }
    } else {
      signIn('aws-email', { email, callbackUrl });
    }
  };

  const handleMicrosoftSignIn = () => {
    signIn('azure-ad', { callbackUrl });
  };

  return (
    <Card sx={{ maxWidth: 500, width: isLaptop ? '100%' : '91%', p: isLaptop ? 3 : 1 }}>
      <CardContent>
        <Typography variant="h4" align="center" gutterBottom>
          {" Newbury Residential's Portal"}
        </Typography>
        <Typography variant="body1" align="center" gutterBottom sx={{ mt: 3 }}>
          Log in with Microsoft if you have a work email or use your personal email registered with Paylocity{' '}
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Button
            onClick={handleMicrosoftSignIn}
            sx={{
              mt: 5.5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: (theme) => theme.palette.mode === 'light' ? '#fff' : '#333',
              border: '1px solid #ccc',
              borderRadius: '6px',
              padding: '8px 16px',
              textTransform: 'none',
              width: '100%', // Set width to 100%
              height: '53.11px', // Match the height
              position: 'relative', // For absolute positioning of text
            }}
          >
            <img
              src="https://admin-portal-intranet.s3.amazonaws.com/Microsoft_logo.svg.png"
              alt="Microsoft logo"
              style={{ position: 'absolute', left: '16px', width: '29px', height: '29px' }}
            />
            <Typography
              sx={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                fontWeight: 600,
              }}
            >
              {isLaptop ? 'Sign in with Microsoft' : 'Office Sign In'}
            </Typography>
          </Button>

          <Divider
            sx={{
              my: 3.5,
              typography: 'overline',
              color: 'text.disabled',
              '&::before, &::after': {
                borderTopStyle: 'dashed',
                borderTopWidth: '1px',
                borderTopColor: 'text.disabled',
              },
              width: '100%',
            }}
          >
            OR
          </Divider>
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                placeholder="Personal Email"
                error={!!errors.email}
                helperText={errors.email ? errors.email.message : ''}
                sx={{ mb: 2, width: '100%' }}
              />
            )}
          />
          <LoadingButton loading={loading} variant="contained" type="submit" fullWidth>
            Log in as Guest
          </LoadingButton>
        </Box>
      </CardContent>
    </Card>
  );
}
