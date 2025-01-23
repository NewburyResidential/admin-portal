import { Body, Container, Head, Heading, Hr, Html, Img, Preview, Section, Text } from '@react-email/components';
import React from 'react';

const LoginNotificationEmail = ({ email }) => (
  <Html>
    <Head />
    <Preview>Notification of Login</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={heading}>Notification of Login</Heading>

        <Hr style={hr} />
        <Text style={paragraph}>{email} is trying to login. Please verify the email is not spam.</Text>

        <Section style={containerImageFooter}>
          <Img style={image} width={620} src="https://admin-portal-intranet.s3.amazonaws.com/apartment-footer.png" />
        </Section>
      </Container>
    </Body>
  </Html>
);

export default LoginNotificationEmail;

const main = {
  backgroundColor: '#ffffff',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif',
};

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  maxWidth: '560px',
};

const heading = {
  fontSize: '24px',
  letterSpacing: '-0.5px',
  lineHeight: '1.3',
  fontWeight: '400',
  color: '#484848',
  padding: '17px 0 0',
};

const paragraph = {
  margin: '0 0 15px',
  fontSize: '15px',
  lineHeight: '1.4',
  color: '#3c4149',
  marginTop: '10px',
};

const hr = {
  borderColor: '#dfe1e4',
  margin: '32px 0 26px',
};

const containerImageFooter = {
  padding: '45px 0 0 0',
};

const image = {
  maxWidth: '100%',
};
