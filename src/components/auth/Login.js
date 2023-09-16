'use client';

import PropTypes from 'prop-types';
import { useRouter } from 'next/router'; 

import { useEffect } from 'react';
import { SplashScreen } from 'src/components/loading-screen';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function Login({ redirectPath }) {
  const router = useRouter(); 
  const supabase = createClientComponentClient();
  const signInWithAzure = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'azure',
      options: {
        scopes: 'email',
        redirectTo: `${router.basePath}/api/auth/?redirectedFrom=${redirectPath}`,
      },
    });
  };

  // useEffect(() => {
  //   signInWithAzure();
  // }, [signInWithAzure]);
  signInWithAzure();
  return <SplashScreen />

}

Login.propTypes = {
  redirectPath: PropTypes.string
};