import { Body, Button, Container, Head, Heading, Hr, Html, Img, Preview, Section, Text } from '@react-email/components';
import React from 'react';

const BrianEmail = ({ url }) => (
  <Html>
    <Head />
    {/* <Preview>Authenticated Log In</Preview> */}
    <Body style={main}>
      <Container style={container}>
        <table width="100%" style={{ textAlign: 'center', marginBottom: '20px' }}>
          <tr>
            <td style={{ textAlign: 'center', padding: '20px 0' }}>
              <Img src="https://newburypublic.s3.amazonaws.com/website/logo.png" width="174" height="140" alt="Linear" />
            </td>
          </tr>
        </table>
        <Heading style={heading}>Welcome To Newbury Residential, Brian!</Heading>
        <Hr style={hr} />
        <Section style={buttonContainer}>
          <Button style={button} href={url}>
            Login to Newbury&apos;s Portal
          </Button>
        </Section>
        <Text style={paragraph}>
          Welcome to Newbury Residential! We are thrilled to have you on board and look forward to working with you. Please click the link
          above to begin your onboarding process and access important information to help you get started
          <br />
          <br />
          <b>
            Note Brian: This link will provide direct authenticated access to our portal and bypass login. I'm sharing the login link so you
            can try the login feature as well. USE LOGIN WITH EMAIL USING YOUR "Brian@Newburyresidential.com" EMAIL
          </b>
        </Text>
        <Section style={containerImageFooter}>
          <Img style={image} width={620} src="https://admin-portal-intranet.s3.amazonaws.com/apartment-footer.png" />
        </Section>
      </Container>
    </Body>
  </Html>
);

export default BrianEmail;

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
