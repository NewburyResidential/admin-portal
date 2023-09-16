import PropTypes from 'prop-types';

// @mui
import AppBar from '@mui/material/AppBar';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import DialogActions from '@mui/material/DialogActions';

// Components
import Iconify from 'src/components/iconify';
import ApprovalDataTable from './ApprovalDataTable';


// ----------------------------------------------------------------------

export default function UtilityDialog({ dialog, data }) {
  return (
    <Dialog open={dialog.value} maxWidth="lg" onClose={dialog.onFalse} fullWidth>
      <AppBar position="relative" color="default">
        <Toolbar>
          <IconButton color="inherit" edge="start" onClick={dialog.onFalse}>
            <Iconify icon="mingcute:close-line" />
          </IconButton>
          <Typography variant="h6" sx={{ flex: 1, ml: 2 }}>
            Electric & Gas Approval
          </Typography>
        </Toolbar>
      </AppBar>
      <ApprovalDataTable rows={data} />
      <DialogActions>
        <Button sx={{ width: '80px' }} onClick={dialog.onFalse} variant="outlined">
          Deny
        </Button>
        <Button sx={{ width: '80px' }} onClick={dialog.onFalse} variant="contained">
          Approve
        </Button>
      </DialogActions>
    </Dialog>
  );
}

UtilityDialog.propTypes = {
  dialog: PropTypes.object,
  data: PropTypes.array,
};
