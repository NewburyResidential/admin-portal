'use client';

// @mui
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
// components
import { useSettingsContext } from 'src/components/display-settings';
import UploadMultiFiles from 'src/components/upload-files/UploadMultiFiles';

// ----------------------------------------------------------------------

export default function SpringportView() {
  return (
    <Container>
      <Typography sx={{mb: 6}} variant="h4">2138 SpringPort Utilities </Typography>
      <UploadMultiFiles />
      <Box
        sx={{
          mt: 5,
          width: 1,
          height: 320,
          borderRadius: 2,
          bgcolor: (theme) => alpha(theme.palette.grey[500], 0.04),
          border: (theme) => `dashed 1px ${theme.palette.divider}`,
        }}
      />
    </Container>
  );
}
