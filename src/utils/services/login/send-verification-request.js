"use server";

import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import  LoginEmail from 'src/utils/services/email/LoginEmail';
import { render } from '@react-email/render';

// Initialize the SES Client using environment variables
const sesClient = new SESClient({
  region: 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export async function sendVerificationRequest({ identifier: email, url }) {
  const emailHtml = render(<LoginEmail url={url} />);

  const params = {
    Source: 'Mike@newburyresidential.com',
    Destination: {
      ToAddresses: [email],
    },
    Message: {
      Subject: {
        Data: 'Login Request - Newbury Residential',
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
    throw new Error(JSON.stringify(error));
  }
}
