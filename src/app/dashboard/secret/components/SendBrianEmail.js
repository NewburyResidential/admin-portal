'use client';

import { Button } from '@mui/material';
import { sendWelcomeEmail } from '../send-brian';

export default function SendBrianEmail() {
  const handleSendEmail = async () => {
    sendWelcomeEmail();
    console.log('hi');
  };

  return (
    <Button variant="contained" color="primary" sx={{ p: 7, height: '50px' }} onClick={handleSendEmail}>
      Send Brian Email
    </Button>
  );
}
