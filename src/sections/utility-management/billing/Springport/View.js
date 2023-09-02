'use client';

// @mui
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
// components
import { useSettingsContext } from 'src/components/display-settings';
import UploadMultiFiles from 'src/components/upload-files/UploadMultiFiles';
import UtilityProgress from './UtilityProgress';

// ----------------------------------------------------------------------

export default function View() {
  return (
    <Container>
      <Typography sx={{mb: 6}} variant="h4">2138 SpringPort Utilities </Typography>
      <Grid container >
        <Grid xs={9}>
        <UtilityProgress />
        </Grid>
      </Grid>
  
      <UploadMultiFiles />
    </Container>
  );
}
