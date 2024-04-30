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

export default function ShortcutCard({ label, description, image, url, color, editMode, openDialog }) {
  const handleEdit = (event) => {
    event.stopPropagation();
    openDialog();
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
          onClick={() => {
            console.log('card clicked');
          }}
        >
          {label !== 'Add New Shortcut' ? (
            <CardMedia component="img" sx={{ width: 100, height: '100%', objectFit: 'cover' }} image={image} alt={label} />
          ) : (
            <Iconify
              icon="mdi:plus"
              sx={{
                width: 110,
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
          {label !== 'Add New Shortcut' && editMode && (
            <IconButton onClick={handleEdit} sx={{ position: 'absolute', top: '50%', right: '16px', transform: 'translateY(-50%)' }}>
              <EditIcon />
            </IconButton>
          )}
        </Card>
      </m.div>
    </>
  );
}
