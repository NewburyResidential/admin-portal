'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';

// @mui

import Grid from '@mui/material/Unstable_Grid2';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
// components

import UploadUtilityBills from '../UploadUtilityBills';

import UtilityDialog from '../UtilityDialog';
import UtilitiesReview from '../UtilitiesReview';

// ----------------------------------------------------------------------

export default function View() {
  const searchParams = useSearchParams();
  const utilityType = searchParams.get('utility');



  const [data, setData] = useState(1);
  return (
    <Container>
      <Typography sx={{ mb: 6 }} variant="h4">2138 SpringPort Utilities</Typography>
      {utilityType && <UtilityDialog data={[]} setData={setData} />}
      <UtilitiesReview />
      <Grid container spacing={3} mb={3}></Grid>
      <UploadUtilityBills setData={setData} />
    </Container>
  );
}

// import UtilityProgressWidget from '../UtilityProgressWidget';
// import MonthWidget from '../MonthWidget';
// import Calendar from '../Calendar';

/* <Grid xs={9}>
          <UtilityProgressWidget handleOpenDrawer={handleOpenDrawer} />
        </Grid> */

/* <Grid xs={3}>
          <MonthWidget title="September" subTitle="Billing Utilities" />
        </Grid> */

/* <Calendar /> */
