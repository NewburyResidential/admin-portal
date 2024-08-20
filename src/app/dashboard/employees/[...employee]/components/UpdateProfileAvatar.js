import React, { useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, IconButton, Typography } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import { alpha } from '@mui/material/styles';
import { m } from 'framer-motion';
import { _mock } from 'src/_mock';
import CloseIcon from '@mui/icons-material/Close'; // Import Close icon
import Box from '@mui/material/Box';

export default function UpdateProfileAvatar({ name, avatarUrl, open, setOpen }) {
  const [selectedAvatar, setSelectedAvatar] = useState(null);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title" maxWidth="lg">
        <DialogTitle id="form-dialog-title" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5" sx={{ ml: 2 }}>
            Update Profile Avatar
          </Typography>
          <IconButton onClick={handleClose} sx={{ ml: 2 }}>
            <CloseIcon color="error" sx={{ fontSize: '36px' }} />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          <Box
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: 30,
              padding: 8,
              marginTop: '20px',
              marginBottom: '58px',
            }}
          >
            {Array.from({ length: 26 }).map((_, index) => (
              <IconButton
                key={index}
                component={m.button}
                whileHover={{ scale: 1.1 }}
                sx={{
                  width: 128,
                  height: 128,
                  background: (theme) => alpha(theme.palette.grey[500], 0.08),
                  ...(avatarUrl === _mock.image.avatar(index - 1) || (avatarUrl === null && index === 0) && {
                    background: (theme) => `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
                  }),
                }}
                onClick={() => setOpen(false)}
              >
                <Avatar
                  src={_mock.image.avatar(index - 1)}
                  //alt={`Avatar ${index + 1}`}
                  sx={{
                    width: 116,
                    height: 116,
                    fontSize: 48,
                    border: (theme) => `solid 2px ${theme.palette.background.default}`,
                  }}
                >
                  {name.charAt(0).toUpperCase()}
                </Avatar>
              </IconButton>
            ))}
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
}
