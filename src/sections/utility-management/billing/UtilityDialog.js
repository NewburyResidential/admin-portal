import PropTypes from 'prop-types';
import { useRouter, usePathname } from 'next/navigation';
import { forwardRef } from 'react';

// @mui
import AppBar from '@mui/material/AppBar';
import Dialog from '@mui/material/Dialog';
import Toolbar from '@mui/material/Toolbar';
import Slide from '@mui/material/Slide';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

// Components
import Iconify from 'src/components/iconify';
import ApprovalDataTable from './ApprovalDataTable';
import { Box, Card, Container, Stack } from '@mui/material';
import Errors from './dialog/Errors';

// ----------------------------------------------------------------------

export default function UtilityDialog({ setData, data }) {
  const router = useRouter();
  const pathname = usePathname();
  const Transition = forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

  return (
    <Dialog
      open={true}
      TransitionComponent={Transition}
      fullScreen
      onClose={() => {
        router.push(pathname);
      }}
    >
      <AppBar position="relative" color="default">
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={() => {
              router.push(pathname);
            }}
          >
            <Iconify icon="mingcute:close-line" />
          </IconButton>
          <Typography variant="h6" sx={{ flex: 1, ml: 2 }}>
            Consumers Energy
          </Typography>
        </Toolbar>
      </AppBar>
      <Stack spacing={3} sx={{ mx: 3, mt: 1 }}>
        <Errors />
        <Card>
          <ApprovalDataTable rows={data} />
        </Card>
      </Stack>
    </Dialog>
  );
}

UtilityDialog.propTypes = {
  data: PropTypes.array,
};
