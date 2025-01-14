import { useState, forwardRef } from 'react';

import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import InfoDialog from './InfoDialog';

const Alert = forwardRef((props, ref) => {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function ResponseSnackbar({ snackbarConfig, setSnackbarConfig }) {
  const { open, isAdmin, errors } = snackbarConfig;

  const infoDialogExists = errors.some((error) => error.infoDialog);
  const groupedSeverity = errors.every((error) => error.severity === 'success') ? 'success' : 'error';

  const moreThanOneError = errors.length > 1;

  const snackBarMessage = moreThanOneError
    ? groupedSeverity === 'success'
      ? 'All Items succeeded'
      : 'An Error Occured'
    : errors[0]?.message || 'No message available';
  const snackBarSeverity = moreThanOneError ? groupedSeverity : errors[0]?.severity;

  const [showInfoDialog, setShowInfoDialog] = useState(false);

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarConfig((prevConfig) => ({ ...prevConfig, open: false }));
  };
  const toggleInfoDialog = () => {
    setShowInfoDialog((prev) => !prev);
  };

  const handleAction = () => {
    if (infoDialogExists) {
      toggleInfoDialog();
    }
  };

  const showInfoDialogButton = (!!infoDialogExists && groupedSeverity === 'error') || (isAdmin && !!infoDialogExists);

  return (
    <>
      <InfoDialog open={showInfoDialog} onClose={toggleInfoDialog} errors={errors} isAdmin={isAdmin} />
      <Snackbar
        open={open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          action={
            showInfoDialogButton ? (
              <Button color="inherit" size="small" onClick={handleAction} sx={{ fontWeight: '700' }}>
                Show
              </Button>
            ) : null
          }
          onClose={handleCloseSnackbar}
          severity={snackBarSeverity}
          sx={{ width: '100%' }}
        >
          {snackBarMessage}
        </Alert>
      </Snackbar>
    </>
  );
}
