import NextAuth from 'next-auth/next';
import AzureADProvider from 'next-auth/providers/azure-ad';
import { sendVerificationRequest } from '../../../../utils/services/login/send-verification-request';

import { DynamoDB } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';
import { DynamoDBAdapter } from '@auth/dynamodb-adapter';
import { getAuthorizedUserByEmail } from 'src/utils/services/employees/getAuthorizedUserByEmail';
import * as Sentry from '@sentry/nextjs';

const config = {
  region: 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
};

const client = DynamoDBDocument.from(new DynamoDB(config), {
  marshallOptions: {
    convertEmptyValues: true,
    removeUndefinedValues: true,
    convertClassInstanceToMap: true,
  },
});

export const authOptions = {
  adapter: DynamoDBAdapter(client),
  providers: [
    AzureADProvider({
      clientId: process.env.AZURE_AD_CLIENT_ID,
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET,
      tenantId: process.env.AZURE_AD_TENANT_ID,
    }),
    {
      id: 'aws-email',
      type: 'email',
      sendVerificationRequest,
    },
  ],
  pages: {
    signIn: '/auth/login',
    verifyRequest: '/auth/verify',
    error: '/auth/unauthorized',
  },
  callbacks: {
    async signIn({ user }) {
      const email = user?.email;
      const employeeData = await getAuthorizedUserByEmail(email);
      if (!employeeData) {
        const encodedEmail = encodeURIComponent(email);
        return `/auth/unauthorized/login?email=${encodedEmail}`;
      }
      return true;
    },
    async session({ session }) {
      const email = session?.user?.email;
      const employeeData = await getAuthorizedUserByEmail(email);
      if (employeeData) {
        session.user = { ...session.user, ...employeeData };
        Sentry.getGlobalScope().setUser({
          name: session.user.fullName,
          status: session.user.status,
          id: session.user.pk,
          email: session.user.workEmail || session.user.personalEmail,
          roles: JSON.stringify(session.user.roles), // Stringify roles array
          ip_address: '{{auto}}',
        });
      }

      return session;
    },
  },

  session: {
    strategy: 'jwt',
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
