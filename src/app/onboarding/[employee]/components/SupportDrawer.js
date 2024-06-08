import { useState } from 'react';

import Drawer from '@mui/material/Drawer';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { LoadingButton } from '@mui/lab';

import { sendSupportEmail } from 'src/utils/services/email/sendSupportEmail';

export default function SupportDrawer({ email, open, handleClose }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSend = async () => {
    if (!message) return;
    setLoading(true);
    await sendSupportEmail({ email, message });
    handleClose();
    setLoading(false);
    setMessage('');
  };

  return (
    <Drawer anchor="bottom" open={open} onClose={handleClose} PaperProps={{ style: { width: '100%' } }}>
      <Box padding={5} position="relative">
        <Typography variant="h4" mb={1}>
          Send Us A Message!
        </Typography>
        <Typography variant="body1" mb={3}>
          Facing issues or need an answer? Leave us a message and our team will get back to you.
        </Typography>

        <TextField
          label="Your Question"
          variant="outlined"
          multiline
          rows={3}
          fullWidth
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <Box mt={2} sx={{ display: 'flex', justifyContent: 'end' }}>
          <Button sx={{ width: '100px', mr: 3 }} variant="" color="inherit" onClick={handleClose}>
            Close
          </Button>
          <LoadingButton loading={loading} sx={{ width: '180px' }} variant="contained" color="inherit" onClick={handleSend}>
            Send
          </LoadingButton>
        </Box>
      </Box>
    </Drawer>
  );
}
