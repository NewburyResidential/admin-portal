'use client';

import { useEffect } from 'react';
import { signIn } from 'next-auth/react';
import { SplashScreen } from 'src/components/loading-screen';

export default function Login({ session, params }) {
  const callbackUrl = params || '/dashboard';
  useEffect(() => {
    if (!session) {
      signIn('azure-ad', { callbackUrl });
    }
  }, [params, session]);

  return (
    <>
      <SplashScreen />
    </>
  );
}
