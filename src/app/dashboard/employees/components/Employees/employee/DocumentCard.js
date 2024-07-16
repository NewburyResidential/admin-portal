import PropTypes from 'prop-types';
import { useState, useCallback } from 'react';
// @mui
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// components
import Iconify from 'src/components/iconify';
import FileThumbnail from 'src/components/file-thumbnail';
import { Chip, Icon } from '@mui/material';
import EditFileDialog from './editFile/Dialog';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

const DocumentCard = ({ document, setEditDialog }) => {
  const documentIsComplete = document.status === '#COMPLETE';
  const documentIsRequired = document.required;
  const popover = usePopover(); 

  const handleEdit = () => {
    setEditDialog({ open: true, documentData: document });
  };

  const renderText = (
    <ListItemText
      primary={document.label}
      secondary={documentIsComplete ? 'Uploaded 05/14/2024' : null}
      primaryTypographyProps={{
        noWrap: true,
        typography: 'subtitle2',
      }}
      secondaryTypographyProps={{
        mt: 0.5,
        component: 'span',
        alignItems: 'center',
        typography: 'caption',
        color: 'text.disabled',
        display: 'inline-flex',
      }}
    />
  );

  const renderCustomPopover = (
    <CustomPopover open={popover.open} onClose={popover.onClose} arrow="right-top" sx={{ width: 160 }}>
      <MenuItem
        onClick={() => {
          popover.onClose();
          handleEdit();
        }}
      >
        <Iconify icon="fluent:edit-12-filled" />
        Edit
      </MenuItem>

      <MenuItem
        onClick={() => {
          popover.onClose();
        }}
      >
        <Iconify icon="carbon:view-filled" />
        View
      </MenuItem>
      <Divider sx={{ borderStyle: 'dashed' }} />
      <MenuItem
        onClick={() => {
          popover.onClose();
        }}
        sx={{ color: 'error.main' }}
      >
        <Iconify icon="solar:trash-bin-trash-bold" />
        Delete
      </MenuItem>
    </CustomPopover>
  );

  return (
    <>
      <Stack
        component={Paper}
        variant="outlined"
        spacing={1}
        direction={{ xs: 'column', sm: 'row' }}
        alignItems={{ xs: 'unset', sm: 'center' }}
        sx={{
          borderRadius: 2,
          bgcolor: documentIsComplete ? 'unset' : '#FFEDED',
          height: 78,
          cursor: 'pointer',
          position: 'relative',
          p: { xs: 2.5, sm: 2 },
          '&:hover': {
            bgcolor: documentIsComplete ? 'background.paper' : '#FFF0F0',
            boxShadow: (theme) => theme.customShadows.z4,
          },
        }}
      >
        {documentIsRequired ? (
          <Iconify icon={document.icon} width={36} height={36} sx={{ mr: 2, ml: 1 }} />
        ) : (
          <FileThumbnail file={document.fileName} sx={{ width: 36, height: 36, mr: 1 }} />
        )}

        {renderText}
        {!documentIsComplete && <Chip label="Not Complete" color="error" variant="outlined" />}
        <IconButton sx={{ mr: 0 }} onClick={popover.onOpen} color={popover.open ? 'inherit' : 'default'}>
          <Iconify icon="bi:three-dots-vertical" width={24} />
        </IconButton>
        {renderCustomPopover}
      </Stack>
    </>
  );
};

export default DocumentCard;
