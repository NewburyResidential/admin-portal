import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit'; // Ensure you import EditIcon from Material-UI icons
import Box from '@mui/material/Box';
import Iconify from 'src/components/iconify';
import { m } from 'framer-motion';
import Chip from '@mui/material/Chip'; // Ensure you import Chip from Material-UI
import { clearanceOptions } from './addItem/resource-data';

export default function ShortcutCard({
  clearanceLevels,
  label,
  description,
  logo,
  url,
  color,
  editMode,
  openDialog,
  isSupportTicket = false,
  isAddNew = false,
  updatedBy,
  updatedOn,
}) {
  console.log(clearanceLevels);
  const handleEdit = (event) => {
    event.stopPropagation();
    openDialog();
  };

  const handleClick = () => {
    if (isAddNew) {
      openDialog();
      return;
    }
    console.log(url);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <>
      <m.div whileHover={{ scale: 0.99, transition: { duration: 0.2 } }}>
        <Card
          sx={{
            display: 'flex',
            width: 1,
            borderRadius: 0,
            height: '65px',
            backgroundColor: color,
            border: '1px solid #D3D3D3',
            position: 'relative',
            cursor: 'pointer',
          }}
          onClick={handleClick}
        >
          {!isAddNew && !isSupportTicket ? (
            <CardMedia component="img" sx={{ width: 100, height: '100%', objectFit: 'cover' }} image={logo} alt={label} />
          ) : isSupportTicket ? (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Iconify
                icon="gridicons:add-outline"
                sx={{
                  width: 100,
                  height: '78%',
                  color: '#C5B358',
                  fontSize: '2rem',
                }}
              ></Iconify>
            </Box>
          ) : (
            <Iconify
              icon="mdi:plus"
              sx={{
                width: 100,
                height: '100%',
                color: '#556B2F',
                fontSize: '2.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            ></Iconify>
          )}
          <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', flexGrow: 1 }}>
            <CardContent sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <Typography variant="h6" sx={{ fontSize: '15px !important' }}>
                {label}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary" component="div" fontSize={'12px'} ml={'1.5px'}>
                {description}
              </Typography>
            </CardContent>
          </Box>
          {!isAddNew && editMode && (
            <IconButton onClick={handleEdit} sx={{ position: 'absolute', top: '50%', right: '16px', transform: 'translateY(-50%)' }}>
              <EditIcon />
            </IconButton>
          )}
        </Card>
        {!isAddNew && editMode && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: 1,
              backgroundColor: '#FFFAFA',
              border: '1px solid #D3D3D3',
            }}
          >
            <Box sx={{ display: 'flex', gap: 0.5 }}>
              {clearanceLevels.map((level) => (
                <Chip key={level} label={clearanceOptions[level]} variant="outlined" sx={{ backgroundColor: 'white' }} />
              ))}
            </Box>
            <Typography variant="caption" sx={{ paddingRight: 2 }}>
              Updated by {updatedBy || 'N/A'} on {updatedOn || 'N/A'}
            </Typography>
          </Box>
        )}
      </m.div>
    </>
  );
}
