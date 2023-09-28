import { Box, Paper, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';

import React from 'react'

export default function Errors() {
    const fileRejections = [1,2]
  return (
    <Paper
      variant="outlined"
      sx={{
        py: 1,
        px: 2,
        mt: 3,
        textAlign: 'left',
        borderStyle: 'dashed',
        borderColor: 'error.main',
        bgcolor: (theme) => alpha(theme.palette.error.main, 0.08),
      }}
    >
      {fileRejections.map(f => {

        return (
          <Box key={f} sx={{ my: 1 }}>
            <Typography variant="subtitle2" noWrap>
              {f} - Error Uploading
            </Typography>

            {/* {errors.map((error) => (
              <Box key={error.code} component="span" sx={{ typography: 'caption' }}>
                - {error.message}
              </Box>
            ))} */}
          </Box>
        );
      })}
    </Paper>
  )
}
