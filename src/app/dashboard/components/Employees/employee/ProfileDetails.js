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
import Information from './Information';

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

export default function ProfileDetails({ employee }) {
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
    <>
      <Information employee={employee} />
      <br />
      <br />
      <Settings employee={employee} />
    </>
  );
}
