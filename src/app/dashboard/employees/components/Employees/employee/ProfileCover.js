import { useState } from 'react';
import PropTypes from 'prop-types';
// @mui
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import ListItemText from '@mui/material/ListItemText';
import Chip from '@mui/material/Chip';
import { useTheme, alpha } from '@mui/material/styles';
import Iconify from 'src/components/iconify';

// theme
import { bgGradient } from 'src/theme/css';
import UpdateProfileAvatar from './UpdateProfileAvatar';

// ----------------------------------------------------------------------

export default function ProfileCover({ name, avatarUrl, role, coverUrl }) {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  //refactor dialog to usehook
  return (
    <>
      <UpdateProfileAvatar name={name} avatarUrl={avatarUrl} open={open} setOpen={setOpen} />
      <Box
        sx={{
          ...bgGradient({
            color: alpha(theme.palette.primary.darker, 0.8),
            imgUrl: coverUrl,
          }),
          height: 1,
          color: 'common.white',
          position: 'relative',
        }}
      >
        <Chip
          label={true ? 'Active Employee' : 'Terminated'}
          color={true ? 'success' : 'error'}
          variant="outlined"
          sx={{
            position: 'absolute',
            top: 22,
            right: 22,
          }}
        />

        <Stack
          direction={{ xs: 'column', md: 'row' }}
          sx={{
            left: { md: 24 },
            bottom: { md: 24 },
            zIndex: { md: 10 },
            pt: { xs: 6, md: 0 },
            position: { md: 'absolute' },
          }}
        >
          <Box
            sx={{ position: 'relative', mx: 'auto' }}
            onClick={() => {
              setOpen(true);
            }}
          >
            <Avatar
              src={avatarUrl}
              //alt={name}
              sx={{
                width: { xs: 64, md: 128 },
                height: { xs: 64, md: 128 },
                border: `solid 3px ${theme.palette.common.white}`,
                transition: 'opacity 0.3s',
                fontSize: 54,
              }}
            >
              {name.charAt(0).toUpperCase()}
            </Avatar>
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                border: 'solid 1px white',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: alpha(theme.palette.grey[900], 0.7),
                color: 'white',
                opacity: 0,
                transition: 'opacity 0.3s',
                cursor: 'pointer',
                '&:hover': {
                  opacity: 1,
                },
              }}
            >
              <Iconify icon="solar:camera-add-bold" width={32} height={32} />
              <Box sx={{ mt: 1, fontSize: 12 }}>Update Avatar</Box>
            </Box>
          </Box>

          <ListItemText
            sx={{
              mt: 3,
              ml: { md: 3 },
              textAlign: { xs: 'center', md: 'unset' },
            }}
            primary={name}
            secondary={role}
            primaryTypographyProps={{
              typography: 'h4',
            }}
            secondaryTypographyProps={{
              mt: 0.5,
              color: 'inherit',
              component: 'span',
              typography: 'body2',
              sx: { opacity: 0.48 },
            }}
          />
        </Stack>
      </Box>
    </>
  );
}

ProfileCover.propTypes = {
  avatarUrl: PropTypes.string,
  coverUrl: PropTypes.string,
  name: PropTypes.string,
  role: PropTypes.string,
};
