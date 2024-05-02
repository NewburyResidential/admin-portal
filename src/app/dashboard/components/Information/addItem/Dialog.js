import Dialog from '@mui/material/Dialog';
import AddItemForm from './Form';

export default function ItemDialog({ open, resource, handleClose, userName }) {
  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <AddItemForm resource={resource} handleClose={handleClose} userName={userName}/>
    </Dialog>
  );
}
