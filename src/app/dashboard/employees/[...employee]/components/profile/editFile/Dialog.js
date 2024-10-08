import Dialog from '@mui/material/Dialog';
import EditFileForm from './Form';

export default function EditFileDialog({
  open,
  documentData,
  handleClose,
  userName,
}) {
  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <EditFileForm
        documentData={documentData}
        handleClose={handleClose}
        userName={userName}
      />
    </Dialog>
  );
}
