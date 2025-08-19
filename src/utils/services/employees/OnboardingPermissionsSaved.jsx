import { Body, Button, Container, Head, Heading, Hr, Html, Img, Preview, Section, Text } from '@react-email/components';
import React from 'react';

const LoginEmail = ({ employee }) => (
  <Html>
    <Head />
    <Preview>Onboarding Permissions Saved</Preview>
    <Body style={main}>
      <Container style={container}>
        <table width="100%" style={{ textAlign: 'center', marginBottom: '20px' }}>
          <tr>
            <td style={{ textAlign: 'center', padding: '20px 0' }}>
              <Img src="https://newburypublic.s3.amazonaws.com/website/logo.png" width="174" height="140" alt="Linear" />
            </td>
          </tr>
        </table>
        <Heading style={heading}>Onboarding Permissions Saved</Heading>
        <Hr style={hr} />
        <Section style={buttonContainer}>
          <Button style={button} href={`https://www.newburyportal.com/dashboard/employees/${employee.pk}/`}>
            View Onboarding Permissions
          </Button>
        </Section>
        <Text style={paragraph}>
          {`${employee.fullName} has had their onboarding permissions saved. Please use the above link to view the permissions.`}
        </Text>
        <Section style={containerImageFooter}>
          <Img style={image} width={620} src="https://admin-portal-intranet.s3.amazonaws.com/apartment-footer.png" />
        </Section>
      </Container>
    </Body>
  </Html>
);

export default LoginEmail;

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
