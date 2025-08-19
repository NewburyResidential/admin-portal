'use server';

import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import { render } from '@react-email/render';
import OnboardingRemindEmail from './OnboardingRemindEmail';

const sesClient = new SESClient({
  region: 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export async function sendOnboardingRemindEmail({ emails, employee }) {
  const emailHtml = await render(<OnboardingRemindEmail employee={employee} />);

  const params = {
    Source: 'Mike@newburyresidential.com',
    Destination: {
      ToAddresses: ['Mike@newburyresidential.com', ...emails],
    },
    Message: {
      Subject: {
        Data: `Onboarding Checklist Reminder - ${employee.fullName}`,
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
