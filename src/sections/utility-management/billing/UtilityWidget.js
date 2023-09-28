import PropTypes from 'prop-types';
import { useRouter, usePathname } from 'next/navigation';

// @mui
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import LinearProgress from '@mui/material/LinearProgress';
// utils
import Iconify from 'src/components/iconify';


// ----------------------------------------------------------------------

export default function UtilityWidget({ title, value, total, icon, ...other }) {
  const router = useRouter();
  const pathname = usePathname();
  return (
    <Card
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
      {/* <Iconify icon="material-symbols:electric-bolt" width={48} sx={{ color: "#FFD700" }} /> */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.6 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%',
            boxShadow: '2px 2px 5px 0px rgba(0, 0, 0, 0.2)',
            width: 52, // Adjust the width and height as needed
            height: 52,
          }}
        >
          <Iconify icon="mdi:gas" width={36} sx={{ color: '#FFA500' }} />
          {/* 76B0F1 */}
        </Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%',
            boxShadow: '2px 2px 5px 0px rgba(0, 0, 0, 0.2)',
            width: 52, // Adjust the width and height as needed
            height: 52,
          }}
        >
          <Iconify icon="material-symbols:electric-bolt" width={36} sx={{ color: '#FFD700' }} />
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
