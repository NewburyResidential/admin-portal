import React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';
import UtilityWidget from './UtilityWidget';
export default function UtilitiesReview({data}) {
  const resultsLength = data.results?.length || 0
  return (
    <>
      <Grid container sx={{width: '100%'}}>
        <Grid xs={12} sm={6} md={12}>
          <UtilityWidget
          resultsLength={resultsLength}
            title="Consumers Energy"
            value={1}
            total={1}
            icon="/assets/icons/app/ic_dropbox.svg"
          />
        </Grid>
      </Grid>
    </>
  );
}
