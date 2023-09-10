import { useState, useCallback } from 'react';
// @mui
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

import Typography from '@mui/material/Typography';

import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Dialog from '@mui/material/Dialog';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import ApprovalDataTable from './ApprovalDataTable';

// hooks


// ----------------------------------------------------------------------

export default function UtilityDialog({dialog, data}) {

  return (
    <>
      <Dialog
        open={dialog.value}
        maxWidth={'lg'}
        onClose={dialog.onFalse}
        fullWidth={true}
      >
        <DialogTitle>Electric and Gas</DialogTitle>

        <DialogContent>
          <Typography sx={{ color: 'text.secondary' }}>
 
          </Typography>
          <Card>
            <CardHeader title="Needs Approval" sx={{ mb: 2 }} />
            <Box sx={{ height: 390 }}>
              <ApprovalDataTable data={data} />
            </Box>
          </Card>
        </DialogContent>

        <DialogActions>
          <Button onClick={dialog.onFalse} variant="contained">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
