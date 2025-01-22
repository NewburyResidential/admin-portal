import { Body, Container, Head, Heading, Hr, Html, Img, Preview, Section, Text } from '@react-email/components';
import React from 'react';

const AccessRequestEmail = ({ email, currentPath, type }) => (
  <Html>
    <Head />
    <Preview>Access Request</Preview>
    <Body style={main}>
      <Container style={container}>
        {type === 'login' ? (
          <Heading style={heading}>Requesting Login Access</Heading>
        ) : (
          <Heading style={heading}>Requesting Page Access</Heading>
        )}
        <Hr style={hr} />
        {type === 'login' ? (
          <Text style={paragraph}>{email} has requested access to login. Please verify the email address and grant access.</Text>
        ) : (
          <Text style={paragraph}>
            {email} has requested access to {currentPath}. Please verify the email address and grant access if applicable.
          </Text>
        )}
        <Section style={containerImageFooter}>
          <Img style={image} width={620} src="https://admin-portal-intranet.s3.amazonaws.com/apartment-footer.png" />
        </Section>
      </Container>
    </Body>
  </Html>
);

export default AccessRequestEmail;

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
