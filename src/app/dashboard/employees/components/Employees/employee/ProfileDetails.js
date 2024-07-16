import { alpha } from '@mui/material/styles';
import { useState } from 'react';
import Fab from '@mui/material/Fab';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import InputBase from '@mui/material/InputBase';
import Grid from '@mui/material/Unstable_Grid2';
import CardHeader from '@mui/material/CardHeader';
import Iconify from 'src/components/iconify';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Chip from '@mui/material/Chip';
import Settings from './Settings';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const specificApplicationAccessOptions = ['App1', 'App2', 'App3', 'App4'];
const rolesOptions = ['Role 1 etc', 'other 3rd role', 'this is another role', 'there are lots of roles'];

export default function ProfileDetails({ user }) {
  const [portalAccess, setPortalAccess] = useState('');
  const [title, setTitle] = useState('');
  const [specificApplicationAccess, setSpecificApplicationAccess] = useState([]);
  const [roles, setRoles] = useState([]);

  const handlePortalAccessChange = (event) => {
    setPortalAccess(event.target.value);
  };

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleSpecificApplicationAccessChange = (event) => {
    const {
      target: { value },
    } = event;
    setSpecificApplicationAccess(typeof value === 'string' ? value.split(',') : value);
  };

  const handleRolesChange = (event) => {
    const {
      target: { value },
    } = event;
    setRoles(typeof value === 'string' ? value.split(',') : value);
  };

  return (
    <Grid container spacing={3} sx={{ display: 'flex'}}>
      <Grid item xs={4} sx={{ display: 'flex', flexDirection: 'column' }}>
        <Card sx={{ flexGrow: 1 }}>
          <Stack spacing={3} sx={{ p: 3 }}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Iconify icon="mingcute:location-fill" width={24} />
              <Box sx={{ typography: 'body2', flex: 1 }}>
                {user.address}, {user.city}, {user.state} {user.zipCode}
              </Box>
            </Stack>
            <Stack direction="row" spacing={2}>
              <Iconify icon="mingcute:birthday-2-fill" width={24} />
              <Box sx={{ typography: 'body2' }}>09/25/2000 (23)</Box>
            </Stack>
            <Stack direction="row" spacing={2}>
              <Iconify icon="ic:baseline-work-history" width={24} />
              <Box sx={{ typography: 'body2' }}>2 Years, 1 month of service</Box>
            </Stack>
            <Stack direction="row" sx={{ typography: 'body2' }}>
              <Iconify icon="fluent:mail-24-filled" width={24} sx={{ mr: 2 }} />
              Mike@newburyresidential.com
            </Stack>
            <Stack direction="row" spacing={2}>
              <Iconify icon="solar:phone-bold" width={24} />
              <Box sx={{ typography: 'body2' }}>{user.phoneNumber}</Box>
            </Stack>
          </Stack>
        </Card>
      </Grid>
      <Settings user={user} />
    </Grid>
  );
}
