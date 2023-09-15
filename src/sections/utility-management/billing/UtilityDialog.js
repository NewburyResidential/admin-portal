// @mui
import AppBar from '@mui/material/AppBar';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import Toolbar from '@mui/material/Toolbar';
import Iconify from 'src/components/iconify';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ApprovalDataTable from './ApprovalDataTable';
import DialogActions from '@mui/material/DialogActions';

// ----------------------------------------------------------------------

export default function UtilityDialog({ dialog, data }) {
  return (
    <>
      <Dialog open={dialog.value} maxWidth="lg" onClose={dialog.onFalse} fullWidth={true}>
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
          <Button sx={{width: '80px'}} onClick={dialog.onFalse}  variant="outlined">
            Deny
          </Button>
          <Button sx={{width: '80px'}} onClick={dialog.onFalse}  variant="contained">
            Approve
          </Button>
        </DialogActions>
        
      </Dialog>
    </>
  );
}
