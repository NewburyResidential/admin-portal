'use client';

import Paper from '@mui/material/Paper';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import Iconify from 'src/components/iconify';
import Chip from '@mui/material/Chip';

export default function TaskCard({ task, handleClick, hasApprovalRights }) {
  const isFinishedView = task.status === '#COMPLETE' || (!hasApprovalRights && task.status === '#PENDING');

  const renderText = (
    <ListItemText
      primary={task.label}
      secondary={task.description}
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

  return (
    <Stack
        onClick={() => {
          if (!isFinishedView) handleClick();
        }}
        component={Paper}
        variant="outlined"
        spacing={1}
        mt={3}
        direction={{ xs: 'column', sm: 'row' }}
        alignItems={{ xs: 'unset', sm: 'center' }}
        sx={{
          borderRadius: 2,
          opacity: isFinishedView ? 0.5 : 1,
          bgcolor: 'background.paper',
          boxShadow: (theme) => !isFinishedView && theme.customShadows.z1,
          height: 78,
          cursor: !isFinishedView && 'pointer',
          position: 'relative',
          p: { xs: 2.5, sm: 2 },
          '&:hover': {
            bgcolor: !isFinishedView && 'background.paper',
            boxShadow: (theme) => !isFinishedView && theme.customShadows.z16,
          },
        }}
      >
        <Iconify icon={task.icon} width={36} height={36} sx={{ mr: 2, ml: 1 }} />

        {renderText}
        {task.status === '#COMPLETE' && <Chip label="Complete" color="success" variant="filled" />}
        {task.status === '#PENDING' && <Chip label="Awaiting Approval" color="warning" variant="filled" />}
        {task.status === '#INCOMPLETE' && <Chip label="Not Complete" color="error" variant="filled" />}
      </Stack>
  );
}
