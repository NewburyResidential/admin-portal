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

  // Skip if no errors
  if (!errors.length) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md">
      {errors.length > 1 && (
        <DialogTitle
            sx={(theme) => ({
              borderTop: `6px solid ${theme.palette[errors[activeTab].severity].main}`,
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
                      color: theme.palette[error.severity].dark,
                    },
                    '&.Mui-selected': {
                      color: theme.palette[error.severity].main,
                    },
                  })}
                />
              ))}
            </Tabs>
            <Box mt={2}>{errors[activeTab]?.message}</Box>
          </DialogTitle>
      )}

      {errors.length === 1 && (
        <DialogTitle
          sx={(theme) => ({
            borderTop: `6px solid ${theme.palette[errors[activeTab].severity].main}`,
          })}
        >
          {errors[activeTab]?.message}
        </DialogTitle>
      )}

      <DialogContent>
        {isAdmin ? (
          <>
            {errors[activeTab]?.infoDialog?.summary && (
              <Typography variant="h6" color={(theme) => `${theme.palette[errors[activeTab].severity].dark}`} mb={3}>
                {errors[activeTab]?.infoDialog?.summary}
              </Typography>
            )}

            <Box
              sx={{
                maxHeight: '60vh',
                overflowY: 'auto',
              }}
            >
              {errors[activeTab].infoDialog?.stack ? (
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
                  {errors[activeTab].infoDialog.stack}
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
