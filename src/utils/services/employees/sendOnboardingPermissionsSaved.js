'use server';

import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import { render } from '@react-email/render';
import OnboardingPermissionsSaved from './OnboardingPermissionsSaved';

const sesClient = new SESClient({
  region: 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export async function sendOnboardingPermissionsSaved({ employee }) {
  const emailHtml = await render(<OnboardingPermissionsSaved employee={employee} />);

  const params = {
    Source: 'Mike@newburyresidential.com',
    Destination: {
      ToAddresses: ['Mike@newburyresidential.com'],
    },
    Message: {
      Subject: {
        Data: `Onboarding Permissions Saved - ${employee.fullName}`,
      },
      Body: {
        Html: {
          Data: emailHtml,
        },
      },
    },
  };

  const command = new SendEmailCommand(params);

  try {
    // Sending the email
    const response = await sesClient.send(command);
    console.log('Email sent:', response);
  } catch (error) {
    console.error('Failed to send email:', error);
    //throw new Error(JSON.stringify(error));
  }
}
