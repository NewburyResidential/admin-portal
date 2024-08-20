import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import SeverErrorIllustration from 'src/assets/illustrations/sever-error-illustration';
import MaintenanceIllustration from 'src/assets/illustrations/maintenance-illustration';

export default function InfoDialog({ open, onClose, infoDialog, message, severity, isAdmin }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md">
      <DialogTitle sx={(theme) => ({ borderTop: `6px solid ${theme.palette[severity].main}` })}>{message}</DialogTitle>
      <DialogContent>
        {isAdmin ? (
          <>
            {infoDialog?.summary && (
              <Typography variant="h6" color={(theme) => `${theme.palette[severity].dark}`} mb={3}>
                {infoDialog.summary}
              </Typography>
            )}

            <Box
              sx={{
                maxHeight: '60vh',
                overflowY: 'auto',
              }}
            >
              <Typography
                component="pre"
                sx={{
                  fontFamily: 'monospace',
                  whiteSpace: 'pre-wrap',
                  color: '#fff',
                  backgroundColor: '#000',
                  padding: '8px',
                  borderRadius: '4px',
                  overflowX: 'auto',
                }}
              >
                {infoDialog?.stack}
              </Typography>
            </Box>
          </>
        ) : (
          <>
            <Typography variant="h6" color="error.dark" mb={3}>
              An Error occured with your request. An IT team member has been notified and is working to fix the issue. Please submit a
              support ticket if you need immediate assistance.
            </Typography>
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={onClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
