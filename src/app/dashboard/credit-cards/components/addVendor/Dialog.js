import Dialog from '@mui/material/Dialog';
import AddVendorForm from './Form';

export default function VendorDialog({ open, defaultValue, handleClose }) {
  return (
    <Dialog open={open} onClose={handleClose}>
      <AddVendorForm defaultVendorValue={defaultValue} handleClose={handleClose} />
    </Dialog>
  );
}
