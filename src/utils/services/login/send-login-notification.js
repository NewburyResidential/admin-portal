'use server';

//TO DO - add email for application access
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import LoginNotificationEmail from '../email/LoginNotificationEmail';
import { render } from '@react-email/render';

const sesClient = new SESClient({
  region: 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export async function sendLoginNotification({ email }) {
  const emailHtml = await render(<LoginNotificationEmail email={email} />);

  const params = {
    Source: 'Mike@newburyresidential.com',
    Destination: {
      ToAddresses: ['Mike@newburyresidential.com'],
    },
    Message: {
      Subject: {
        Data: 'Login Notification - Newbury Residential',
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
