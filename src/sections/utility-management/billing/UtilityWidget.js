import PropTypes from 'prop-types';
import { useRouter, usePathname } from 'next/navigation';
import { m } from 'framer-motion';

// @mui
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import LinearProgress from '@mui/material/LinearProgress';
// utils
import Iconify from 'src/components/iconify';
import { varHover } from 'src/components/animate';
import Label from 'src/components/label/label';



// ----------------------------------------------------------------------

export default function UtilityWidget({ title, value, total, icon, resultsLength, ...other }) {
  const router = useRouter();
  const pathname = usePathname();
  return (
    <Card
    component={m.div}
    whileTap="tap"
    whileHover="hover"
    variants={varHover(1.01)}
      sx={{
        mx: "auto",
        cursor: "pointer", 
        p: 3,
      }}
      {...other}
      onClick={() => {
        router.push(`${pathname}/?utility=consumers`);
      }}
    >
       {resultsLength !== 0 && <Box
      sx={{
        position: 'absolute', 
        top: 0, 
        right: 0, 
        pr: 3,
        pt: 3, 
  
      }}
    >
      <Label color="default"  >
        {resultsLength} Bills For Review
      </Label>
    </Box>}
      
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%',
            width: 52, // Adjust the width and height as needed
            height: 52,
            border: (theme) => `2px dashed ${theme.palette.primary.lighter}`,
          }}
        >
          <Iconify icon="mdi:gas" width={36} sx={{ color: 'primary.light' }} />
        </Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%',
            width: 52, // Adjust the width and height as needed
            height: 52,
            border: (theme) => `2px dashed ${theme.palette.primary.lighter}`,
          }}
        >
          <Iconify icon="material-symbols:electric-bolt" width={36} sx={{ color: 'primary.light' }} />
        </Box>
      </Box>

      <Box sx={{ mt: 2.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h6">{title}</Typography>
        
        <Stack
          direction="row"
          spacing={0.5}
          justifyContent="flex-end"
          sx={{ typography: 'subtitle2' }}
        >
          <Box
            sx={{
              typography: 'body2',
              color: 'text.disabled',
            }}
          >
            {value}
          </Box>

          {`/ ${total}`}
        </Stack>
      </Box>

      <LinearProgress
        value={100}
        variant="determinate"
        color="inherit" // inherit
        sx={{
          my: 2,
          height: 6,
          '&::before': {
            bgcolor: 'divider',
            opacity: 1,
          },
        }}
      />
    </Card>
  );
}

UtilityWidget.propTypes = {
  icon: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
  sx: PropTypes.object,
  title: PropTypes.string,
  total: PropTypes.number,
  value: PropTypes.number,
};
