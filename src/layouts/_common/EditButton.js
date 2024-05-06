import { m } from 'framer-motion';
// @mui
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Badge, { badgeClasses } from '@mui/material/Badge';
// components
import Iconify from 'src/components/iconify';
import { varHover } from 'src/components/animate';
import { useSettingsContext } from 'src/components/display-settings';

// ----------------------------------------------------------------------

export default function EditButton({ sx }) {
  const settings = useSettingsContext();

  return (
    <Badge
      color="error"
      variant="dot"
      invisible={!settings.editMode}
      sx={{
        [`& .${badgeClasses.badge}`]: {
          top: 8,
          right: 3,
        },
        ...sx,
      }}
    >
      <Box
        transition={{
          duration: 12,
          ease: 'linear',
          repeat: Infinity,
        }}
      >
        <IconButton
          component={m.button}
          whileTap="tap"
          whileHover="hover"
          variants={varHover(1.05)}
          aria-label="settings"
          onClick={settings.onToggleEditMode}
          sx={{
            width: 40,
            height: 40,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          {settings.editMode ? (
            <Iconify icon="fluent:edit-prohibited-16-filled" width={30} />
          ) : (
            <Iconify icon="fluent:edit-16-filled" width={30} />
          )}
        </IconButton>
      </Box>
    </Badge>
  );
}
