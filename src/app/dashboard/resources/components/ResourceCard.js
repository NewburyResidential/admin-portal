import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Card from '@mui/material/Card';
import EditIcon from '@mui/icons-material/Edit';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CardContent from '@mui/material/CardContent';
import { useRoleOptionsLookup } from 'src/layouts/dashboard/roleOptions';
import { useResponsive } from 'src/hooks/use-responsive';

import { m } from 'framer-motion';
import Iconify from 'src/components/iconify';
import { fileThumb } from 'src/components/file-thumbnail';
import { useTheme } from '@emotion/react';

export default function ResourceCard({
  fileName,
  uploadType,
  roles,
  label,
  description,
  logo,
  url,
  editMode,
  openDialog,
  isSupportTicket = false,
  isAddNew = false,
  isResource = false,
  updatedBy,
  updatedOn,
  color = null,
}) {
  const theme = useTheme();
  const isLaptop = useResponsive('up', 'lg');

  const roleOptionsLookup = useRoleOptionsLookup();
  const handleEdit = (event) => {
    event.stopPropagation();
    openDialog();
  };

  const handleClick = () => {
    if (isAddNew) {
      openDialog();
      return;
    }
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <m.div whileHover={{ scale: 0.99, transition: { duration: 0.2 } }}>
      <Card
        sx={{
          display: 'flex',
          width: 1,
          borderRadius: 0,
          height: '65px',
          backgroundColor: color && color,
          border: (theme) => (theme.palette.mode === 'light' ? '1px solid #D3D3D3' : `1px solid ${theme.palette.grey[700]}`),
          position: 'relative',
          cursor: 'pointer',
        }}
        onClick={handleClick}
      >
        {isResource && uploadType === 'website' ? (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Iconify
              icon="solar:card-search-bold-duotone"
              sx={{
                width: 50,
                ml: 3,
                mr: 1,
                height: '60%',
                color: '#4682B4',
                fontSize: '2.5rem',
              }}
            />
          </Box>
        ) : isResource && uploadType === 'file' ? (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img src={fileThumb(fileName)} alt="File Icon" style={{ marginRight: 19, width: '32px', height: '32px', marginLeft: 31 }} />
          </Box>
        ) : !isAddNew && !isSupportTicket ? (
          <Box sx={{ height: '100%', minWidth: '100px', overflow: 'hidden' }}>
            <CardMedia
              component="img"
              sx={{
                width: '100px',
                height: '100%',
                objectFit: 'cover',
              }}
              image={logo}
              alt={label}
            />
          </Box>
        ) : isSupportTicket ? (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Iconify
              icon="gridicons:add-outline"
              sx={{
                width: 100,
                height: '78%',
                color: 'primary.main',
                fontSize: '2rem',
              }}
            />
          </Box>
        ) : (
          <Iconify
            icon="mdi:plus"
            sx={{
              width: isResource ? 71 : 100,
              ml: isResource ? 1.8 : 0,
              height: '100%',
              color: '#556B2F',
              fontSize: '2.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          />
        )}
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', flexGrow: 1 }}>
          <CardContent sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <Typography variant="h6" sx={{ fontSize: isLaptop ? '15px !important' : '14px !important', fontWeight: !isLaptop && 600 }}>
              {label}
            </Typography>
            {isLaptop && (
              <Typography variant="subtitle1" color="text.secondary" component="div" fontSize="12px" ml="1px">
                {description}
              </Typography>
            )}
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
            backgroundColor: (theme) => (theme.palette.mode === 'light' ? '#FFFAFA' : 'grey.900'),
            border: (theme) => (theme.palette.mode === 'light' ? '1px solid #D3D3D3' : `1px solid ${theme.palette.grey[700]}`),
          }}
        >
          {isLaptop && (
            <Box sx={{ display: 'flex', gap: 0.5 }}>
              {roles?.map((role) => (
                <Chip
                  key={role}
                  label={roleOptionsLookup[role]}
                  variant="outlined"
                  sx={{ backgroundColor: (theme) => (theme.palette.mode === 'light' ? 'common.white' : 'grey.800') }}
                />
              ))}
            </Box>
          )}
          <Typography variant="caption" sx={{ paddingRight: 2 }}>
            Updated by {updatedBy || 'N/A'} on {updatedOn || 'N/A'}
          </Typography>
        </Box>
      )}
    </m.div>
  );
}
