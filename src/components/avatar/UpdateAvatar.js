import { useState } from 'react';

import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import CloseIcon from '@mui/icons-material/Close'; 

import { alpha } from '@mui/material/styles';
import { m } from 'framer-motion';
import { _mock } from 'src/_mock';

export default function UpdateAvatar({ pk, name, avatar, open, handleClose, handleUpdate }) {
  const [selection, setSelection] = useState(null);

  const handleSelect = async (url) => {
    setSelection(url);
    await handleUpdate(pk, url);
    setSelection(null);
  };

  return (
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
                  background:
                    avatar === _mock.image.avatar(index - 1)
                      ? (theme) => `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`
                      : (theme) => alpha(theme.palette.grey[500], 0.08),
                }}
                onClick={() => {
                  handleSelect(_mock.image.avatar(index - 1));
                }}
              >
                {selection === _mock.image.avatar(index - 1) ? (
                  <CircularProgress />
                ) : (
                  <Avatar
                    src={_mock.image.avatar(index - 1)}
                    sx={{
                      width: 116,
                      height: 116,
                      fontSize: 48,
                      border: (theme) => `solid 2px ${theme.palette.background.default}`,
                    }}
                  >
                    {name.charAt(0).toUpperCase()}
                  </Avatar>
                )}
              </IconButton>
            ))}
          </Box>
        </DialogContent>
      </Dialog>
  );
}
