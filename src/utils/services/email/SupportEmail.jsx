import { Body, Container, Head, Heading, Hr, Html, Img, Preview, Section, Text } from '@react-email/components';
import React from 'react';

const SupportEmail = ({ email, message }) => (
  <Html>
    <Head />
    {/* <Preview>Access Request</Preview> */}
    <Body style={main}>
      <Container style={container}>
        <Heading style={heading}>Admin Portal - Help</Heading>
        <Hr style={hr} />

        <Text style={paragraph}>
          {email} has asked the following question: {message}{' '}
        </Text>
        <Section style={containerImageFooter}>
          <Img style={image} width={620} src="https://admin-portal-intranet.s3.amazonaws.com/apartment-footer.png" />
        </Section>
      </Container>
    </Body>
  </Html>
);

export default SupportEmail;

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

const buttonContainer = {
  padding: '27px 0 27px',
};

const button = {
  backgroundColor: '#212B36',
  borderRadius: '3px',
  fontWeight: '600',
  color: '#fff',
  fontSize: '15px',
  textDecoration: 'none',
  textAlign: 'center',
  display: 'block',
  padding: '11px 23px',
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
