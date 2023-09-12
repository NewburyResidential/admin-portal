'use client'
import React, { useEffect } from 'react';


export default function Azure() {
  useEffect(() => {
    async function signInWithAzure() {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'azure',
        options: {
          scopes: 'email',
        },
      });

      if (error) {
        console.error('Azure sign-in error:', error);
      } else {
        // Handle successful sign-in, e.g., redirect or show user data
      }
    }

    signInWithAzure();
  }, []); // The empty dependency array ensures this effect runs only once when the component mounts

  return (
    <div>
      <p>Signing in with Azure...</p>
    </div>
  );
}

