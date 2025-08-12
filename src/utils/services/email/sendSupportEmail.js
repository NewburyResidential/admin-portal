'use server';

//TO DO - add email for application access
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import { render } from '@react-email/render';
import SupportEmail from './SupportEmail';

const sesClient = new SESClient({
  region: 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export async function sendSupportEmail({ email, message }) {
  const emailHtml = await render(<SupportEmail email={email} message={message} />);

  const params = {
    Source: 'Mike@newburyresidential.com',
    Destination: {
      ToAddresses: ['Mike@newburyresidential.com'],
    },
    Message: {
      Subject: {
        Data: 'Help Request - Admin Portal',
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
