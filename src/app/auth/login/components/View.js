'use client';

import { useEffect } from 'react';
import { signIn } from 'next-auth/react';
import { SplashScreen } from 'src/components/loading-screen';
import { useRouter } from 'next/navigation';

export default function View({ session, params }) {
  const router = useRouter();
  const callbackUrl = params || '/dashboard';
  useEffect(() => {
    if (!session) {
      signIn('azure-ad', { callbackUrl });
    } else {
      router.push(callbackUrl);
    }
  }, [params, session, callbackUrl, router]);

  return <SplashScreen />;
}
