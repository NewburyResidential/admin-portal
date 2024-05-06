import Dialog from '@mui/material/Dialog';
import EditResourceCategoryForm from './Form';

export default function ResourceCategoryDialog({ open, category, handleClose, userName, groupId }) {
  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <EditResourceCategoryForm category={category} handleClose={handleClose} userName={userName} groupId={groupId}/>
    </Dialog>
  );
}
