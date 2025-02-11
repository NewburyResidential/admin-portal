import { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

export default function InfoDialog({ open, onClose, errors = [], isAdmin }) {
  const [activeTab, setActiveTab] = useState(0);
  console.log(errors);

  // Skip if no errors or if errors is not an array
  if (!Array.isArray(errors) || !errors.length) return null;

  // Ensure current error exists
  const currentError = errors[activeTab] || {};
  const severity = currentError?.severity || 'error';

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md">
      {errors.length > 1 && (
        <DialogTitle
          sx={(theme) => ({
            borderTop: `6px solid ${theme.palette[severity].main}`,
          })}
        >
          <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)} variant="scrollable" scrollButtons="auto">
            {errors.map((error, index) => (
              <Tab
                key={index}
                label={error?.message || 'No label available'}
                sx={(theme) => ({
                  margin: '4px',
                  borderRadius: '4px',
                  '&.MuiTab-root': {
                    color: theme.palette[error?.severity || 'error'].dark,
                  },
                  '&.Mui-selected': {
                    color: theme.palette[error?.severity || 'error'].main,
                  },
                })}
              />
            ))}
          </Tabs>
          <Box mt={2}>{currentError?.message}</Box>
        </DialogTitle>
      )}

      {errors.length === 1 && (
        <DialogTitle
          sx={(theme) => ({
            borderTop: `6px solid ${theme.palette[severity].main}`,
          })}
        >
          {currentError?.message}
        </DialogTitle>
      )}

      <DialogContent>
        {isAdmin && currentError?.infoDialog ? (
          <>
            {currentError?.infoDialog?.summary && (
              <Typography variant="h6" color={(theme) => `${theme.palette[severity].dark}`} mb={3}>
                {currentError.infoDialog.summary}
              </Typography>
            )}

            <Box
              sx={{
                maxHeight: '60vh',
                overflowY: 'auto',
              }}
            >
              {currentError?.infoDialog?.stack ? (
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
                  {currentError.infoDialog.stack}
                </Typography>
              ) : (
                <Typography variant="body1">No data available</Typography>
              )}
            </Box>
          </>
        ) : (
          <Typography variant="h6" color="error.dark" mb={3}>
            An Error occured with your request. An IT team member has been notified and is working to fix the issue. Please submit a support
            ticket if you need immediate assistance.
          </Typography>
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
