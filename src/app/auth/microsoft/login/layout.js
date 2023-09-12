'use client';
import PropTypes from 'prop-types';

// components

import { Button } from '@mui/material';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';


// ----------------------------------------------------------------------


export default function Layout({ children }) {
  const supabase = createClientComponentClient()


const signInWithAzure = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'azure',
      options: {
        redirectTo: `${location.origin}/api/auth`
      },
    })
} 

  return (
    <>
    <Button onClick={() => {signInWithAzure()}}>
      Log in
    </Button>
  {children}
    </>
  );
}

Layout.propTypes = {
  children: PropTypes.node,
};
