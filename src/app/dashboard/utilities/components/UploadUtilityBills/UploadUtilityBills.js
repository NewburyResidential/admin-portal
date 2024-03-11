import UploadMultiFiles from 'src/components/upload-files/UploadMultiFiles';
import UploadDialog from './UploadDialog';
import { useState } from 'react';

export default function UploadUtilityBills() {
  const [openDialog, setOpenDialog] = useState(false);
  const [files, setFiles] = useState([]);

  const acceptedFiles = {
    // 'image/png': ['.jpg', '.jpeg'],
    'application/pdf': ['.pdf'],
  };

  const onUpload = async () => {
    setOpenDialog(true);
  };

  return (
    <div>
      <UploadDialog files={files} setFiles={setFiles} openDialog={openDialog} setOpenDialog={setOpenDialog} />
      <UploadMultiFiles files={files} setFiles={setFiles} onUpload={onUpload} accept={acceptedFiles} />
    </div>
  );
}
