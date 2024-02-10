import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Grid } from '@mui/material';

export default function EditUtilityBill() {
  const [open, setOpen] = React.useState(true);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Button variant="outlined" onClick={handleClickOpen}>
        Open form dialog
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: 'form',
          onSubmit: (event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries(formData.entries());
            const {email} = formJson;
            console.log(email);
            handleClose();
          },
        }}
      >
        <DialogTitle>Subscribe</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To subscribe to this website, please enter your email address here. We will send updates occasionally.
          </DialogContentText>
          <br />
          <br />
          <Grid container spacing={2}>
            <Grid sx={{ display: 'flex' }} item xs={6} sm={6}>
              <TextField label="Account" fullWidth variant="outlined" />
            </Grid>{' '}
            <Grid sx={{ display: 'flex' }} item xs={3} sm={3}>
              <TextField label="Building" fullWidth variant="outlined" />
            </Grid>
            <Grid sx={{ display: 'flex' }} item xs={3} sm={3}>
              <TextField label="Unit" fullWidth variant="outlined" />
            </Grid>
            <Grid sx={{ display: 'flex' }} item xs={3} sm={6}>
              <TextField label="Start Service" fullWidth variant="outlined" />
            </Grid>
            <Grid sx={{ display: 'flex' }} item xs={3} sm={6}>
              <TextField label="End Service" fullWidth variant="outlined" />
            </Grid>
           
            <Grid sx={{ display: 'flex' }} item xs={3} sm={3}>
              <TextField label="Electric" fullWidth variant="outlined" />
            </Grid>
            <Grid sx={{ display: 'flex' }} item xs={3} sm={3}>
              <TextField label="Gas" fullWidth variant="outlined" />
            </Grid>
            <Grid sx={{ display: 'flex' }} item xs={3} sm={3}>
              <TextField label="Water" fullWidth variant="outlined" />
            </Grid>
            <Grid sx={{ display: 'flex' }} item xs={3} sm={3}>
              <TextField label="Misc" fullWidth variant="outlined" />
            </Grid>
            <Grid sx={{ display: 'flex' }} item xs={3} sm={6}>
              <TextField label="Tax" fullWidth variant="outlined" />
            </Grid>
            <Grid sx={{ display: 'flex' }} item xs={3} sm={6}>
              <TextField label="Total" fullWidth variant="outlined" />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit">Save</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
