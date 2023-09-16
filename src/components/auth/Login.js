'use client';

import { useEffect } from 'react';
import { SplashScreen } from 'src/components/loading-screen';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function Login({ redirectPath }) {
  const supabase = createClientComponentClient();
  const signInWithAzure = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'azure',
      options: {
        scopes: 'email',
        redirectTo: `${location.origin}/api/auth/?redirectedFrom=${redirectPath}`,
      },
    });
  };

  useEffect(() => {
    signInWithAzure();
  }, []);

  return <SplashScreen />

}
