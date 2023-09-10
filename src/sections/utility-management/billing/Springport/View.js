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

import { useBoolean } from 'src/hooks/use-boolean';
import UtilityDialog from '../UtilityDialog';
// ----------------------------------------------------------------------

export default function View() {
  const dialog = useBoolean();
  const [data, setData] = useState([])

  const handleOpenDrawer = () => {
   dialog.onTrue()
  };

  return (
    <Container>
      
      <Typography sx={{ mb: 6 }} variant="h4">
        2138 SpringPort Utilities
      </Typography>
      <UtilityDialog data={data} dialog={dialog}/>
      <Grid container spacing={3}>
        <Grid xs={9}>
          <UtilityProgressWidget handleOpenDrawer={handleOpenDrawer} />
        </Grid>
        <Grid xs={3}>
          <MonthWidget title="September" subTitle="Billing Utilities" />
        </Grid>
      </Grid>
      <UploadUtilityBills setData={setData}/>
      <Calendar />
    </Container>
  );
}
