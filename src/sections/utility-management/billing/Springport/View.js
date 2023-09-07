'use client';
import { useState } from 'react';

// @mui
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
// components
import { useSettingsContext } from 'src/components/display-settings';
import UploadMultiFiles from 'src/components/upload-files/UploadMultiFiles';
import UtilityProgressWidget from '../UtilityProgressWidget';
import MonthWidget from '../MonthWidget';
import UtilityInfoDrawer from '../UtilityInfoDrawer/Drawer';
import Calendar from '../Calendar';
import UploadUtilityBills from '../UploadUtilityBills';

// ----------------------------------------------------------------------

export default function View() {
  const [openDrawer, setOpenDrawer] = useState(false); // Change to Context
  const handleOpenDrawer = () => {
    setOpenDrawer(true);
  };
  return (
    <Container>
      <UtilityInfoDrawer openDrawer={openDrawer} setOpenDrawer={setOpenDrawer} />
      <Typography sx={{ mb: 6 }} variant="h4">
        2138 SpringPort Utilities
      </Typography>
      <Grid container spacing={3}>
        <Grid xs={9}>
          <UtilityProgressWidget handleOpenDrawer={handleOpenDrawer} />
        </Grid>
        <Grid xs={3}>
          <MonthWidget title="September" subTitle="Billing Utilities" />
        </Grid>
      </Grid>
      <UploadUtilityBills />
      <Calendar />
    </Container>
  );
}
