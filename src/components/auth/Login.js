'use client';

import PropTypes from 'prop-types';

import { useEffect } from 'react';
import { SplashScreen } from 'src/components/loading-screen';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function Login({ redirectPath, origin }) {
  console.log(origin)
  const supabase = createClientComponentClient();
  useEffect(() => {
    const signInWithAzure = async () => {
      await supabase.auth.signInWithOAuth({
        provider: 'azure',
        options: {
          scopes: 'email',
          redirectTo: `${origin}/api/auth/?redirectedFrom=${redirectPath}`,
        },
      });
    };
    signInWithAzure();
  }, [redirectPath, supabase.auth, origin]);

  return <SplashScreen />;
}

Login.propTypes = {
  redirectPath: PropTypes.string,
  origin: PropTypes.string,
};
