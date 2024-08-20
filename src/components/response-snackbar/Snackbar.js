import { useState, forwardRef } from 'react';
import { useRouter } from 'next/navigation';

import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import InfoDialog from './InfoDialog';

const Alert = forwardRef((props, ref) => {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function ResponseSnackbar({ snackbarConfig, setSnackbarConfig }) {
  const router = useRouter();

  const { open, isAdmin, severity, message, infoDialog, modalLink } = snackbarConfig;

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
    if (infoDialog) {
      toggleInfoDialog();
    } else if (modalLink) {
      router.push(modalLink);
    }
  };

  const showInfoDialogButton = (!!infoDialog && severity === 'error') || (isAdmin && !!infoDialog);

  return (
    <>
      <InfoDialog
        open={showInfoDialog}
        onClose={toggleInfoDialog}
        infoDialog={infoDialog}
        severity={severity}
        message={message}
        isAdmin={isAdmin}
      />
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
          severity={severity}
          sx={{ width: '100%' }}
        >
          {message}
        </Alert>
      </Snackbar>
    </>
  );
}
