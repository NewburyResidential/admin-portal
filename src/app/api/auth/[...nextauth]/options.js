import azureADProvider from 'next-auth/providers/azure-ad';

export const options = {
  providers: [
    azureADProvider({
      clientId: process.env.AZURE_AD_CLIENT_ID,
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET,
      tenantId: process.env.AZURE_AD_TENANT_ID,
    }),
  ],
  callbacks: {
    async redirect({ url, baseUrl }) {
  
      if ( url.startsWith( "/" ) ) return `${baseUrl}${url}`;
      else {
          const redirectTarget = new URL( url );
          if ( redirectTarget.origin === baseUrl || redirectTarget.origin === "" ) return url;
      }

      return baseUrl;
    },
  },

  pages: {
    signIn: '/auth/login',
    //signOut: '/auth/signout',
    //error: '/auth/error', // Error code passed in query string as ?error=
    //verifyRequest: '/auth/verify-request', // (used for check email message)
    //newUser: '/auth/new-user' // New users will be directed here on first sign in (leave the property out if not of interest)
  },
};
