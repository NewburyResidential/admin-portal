'use client';

import PropTypes from 'prop-types';

import { useEffect } from 'react';
import { SplashScreen } from 'src/components/loading-screen';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { BASEURL } from 'src/config-global';

export default function Login({ redirectPath }) {
  const supabase = createClientComponentClient();
  useEffect(() => {
    const signInWithAzure = async () => {
      await supabase.auth.signInWithOAuth({
        provider: 'azure',
        options: {
          scopes: 'email',
          redirectTo: `${BASEURL}/api/auth/?redirectedFrom=${redirectPath}`,
        },
      });
    };
    signInWithAzure();
  }, [redirectPath, supabase.auth]);

  return <SplashScreen />;
}

Login.propTypes = {
  redirectPath: PropTypes.string,
};
