'use client';

// @mui
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { convertConsumersGasElectric } from 'src/models/ConsumersEnergy';
// components


// ----------------------------------------------------------------------

export default function OneView() {
//convertConsumersGasElectric()
  return (
    <Container >
      <Typography variant="h4"> Page One </Typography>

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
