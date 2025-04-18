import { m } from 'framer-motion';
// @mui
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { varHover } from 'src/components/animate';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import { signOut } from 'next-auth/react'; 


// const OPTIONS = [
//   {
//     label: 'Profile',
//     linkTo: '/#1',
//   },
//   {
//     label: 'Settings',
//     linkTo: '/#2',
//   },
// ];



export default function AccountPopover({session}) {

  const popover = usePopover();

  async function handleLogout() {
    signOut({ redirect: true, callbackUrl: '/auth/logout' });
  }


  return (
    <>
      <IconButton
        component={m.button}
        whileTap="tap"
        whileHover="hover"
        variants={varHover(1.05)}
        onClick={popover.onOpen}
        sx={{
          width: 40,
          height: 40,
          background: (theme) => alpha(theme.palette.grey[500], 0.08),
          ...(popover.open && {
            background: (theme) =>
              `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
          }),
        }}
      >
        <Avatar
          //src={session?.user?.photoURL}
          //alt={user?.displayName}
          sx={{
            width: 36,
            height: 36,
            border: (theme) => `solid 2px ${theme.palette.background.default}`,
          }}
        >
          {session?.user?.fullName?.charAt(0).toUpperCase()}
        </Avatar>
      </IconButton>

      <CustomPopover open={popover.open} onClose={popover.onClose} sx={{ width: 200, p: 0 }}>
        <Box sx={{ p: 2, pb: 1.5 }}>
          <Typography variant="subtitle2" noWrap>
            {session?.user?.fullName}
          </Typography>

          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            {session?.user?.email}
          </Typography>
        </Box>

        {/* <Divider sx={{ borderStyle: 'dashed' }} />

        <Stack sx={{ p: 1 }}>
          {OPTIONS.map((option) => (
            <MenuItem key={option.label} onClick={() => handleClickItem(option.linkTo)}>
              {option.label}
            </MenuItem>
          ))}
        </Stack>

        <Divider sx={{ borderStyle: 'dashed' }} /> */}

        <MenuItem
          onClick={() => {handleLogout()}}
          sx={{ m: 1, fontWeight: 'fontWeightBold', color: 'error.main' }}
        >
          Logout
        </MenuItem>
      </CustomPopover>
    </>
  );
}
