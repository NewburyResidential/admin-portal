import Dialog from '@mui/material/Dialog';
import EditResourceForm from './Form';

export default function EditResourceDialog({
  open,
  resource,
  handleClose,
  userName,
  resourceType,
  groupId = null,
  categoryId = null,
  categoryOptions = {},
}) {
  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth >
      <EditResourceForm
        resource={resource}
        handleClose={handleClose}
        userName={userName}
        resourceType={resourceType}
        groupId={groupId}
        categoryId={categoryId}
        categoryOptions={categoryOptions}
      />
    </Dialog>
  );
}
