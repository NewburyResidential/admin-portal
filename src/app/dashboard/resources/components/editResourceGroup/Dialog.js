import Dialog from '@mui/material/Dialog';
import EditResourceGroupForm from './Form';

export default function ResourceGroupDialog({ resourceObject, open, group, handleClose, userName }) {
  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth >
      <EditResourceGroupForm resourceObject={resourceObject} group={group} handleClose={handleClose} userName={userName}/>
    </Dialog>
  );
}
