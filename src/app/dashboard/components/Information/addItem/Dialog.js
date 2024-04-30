import Dialog from '@mui/material/Dialog';
import AddItemForm from './Form';

export default function ItemDialog({ open, defaultValue, handleClose }) {
  return (
    <Dialog open={open} onClose={handleClose}>
      <AddItemForm defaultVendorValue={defaultValue} handleClose={handleClose} />
    </Dialog>
  );
}
