import { useRef, useState } from 'react';

import { useFormContext } from 'react-hook-form';
import { uploadS3Image } from 'src/utils/services/cc-expenses/uploadS3Image';

import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Iconify from 'src/components/iconify';
import IconButton from '@mui/material/IconButton';
import UploadDialog from './UploadDialog';

export default function AddReceiptUpload({ recentReceipts, transactionIndex, setLoading, hasReceipt, transaction }) {
  const { setValue, getValues } = useFormContext();
  const fileInputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [open, setOpen] = useState(false);

  const handleMenuClick = (event) => setAnchorEl(event.currentTarget);
  const handleCloseMenu = () => setAnchorEl(null);

  const handleDragEvents = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(event.type === 'dragenter' || event.type === 'dragover');
  };

  const processFile = async (file) => {
    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', transaction.id);
    formData.append('bucket', 'admin-portal-receipts');

    try {
      const response = await uploadS3Image(formData);
      if (response) {
        setValue(`transactions[${transactionIndex}].receipt`, response.fileUrl);
        setValue(`transactions[${transactionIndex}].tempPdfReceipt`, response.tempPdfUrl);
      }
    } catch (error) {
      console.error('Error uploading file:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (event) => {
    const files = event.target.files || event.dataTransfer.files;
    if (files.length > 0) {
      processFile(files[0]);
    }
  };

  const handleDrop = (event) => {
    handleDragEvents(event);
    const { files } = event.dataTransfer;
    if (files.length > 0 && ['image/png', 'image/jpeg', 'application/pdf'].includes(files[0].type)) {
      processFile(files[0]);
    } else {
      console.error('File type not allowed');
    }
  };

  const handleUpdateClick = () => {
    setOpen(true);
    handleCloseMenu();
  };

  const handleViewClick = () => {
    const url = getValues(`transactions[${transactionIndex}].receipt`);
    window.open(url, '_blank', 'noopener,noreferrer');
    handleCloseMenu();
  };
  const handleDeleteReceipt = () => {
    setValue(`transactions[${transactionIndex}].receipt`, null);
    setValue(`transactions[${transactionIndex}].tempPdfReceipt`, null);
    handleCloseMenu();
  };

  return (
    <>
      <UploadDialog
        open={open}
        setOpen={setOpen}
        setLoading={setLoading}
        transaction={transaction}
        recentReceipts={recentReceipts}
        transactionIndex={transactionIndex}
      />
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png, image/jpeg, application/pdf"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
      <Box
        onDrop={handleDrop}
        onDragEnter={handleDragEvents}
        onDragOver={handleDragEvents}
        onDragLeave={handleDragEvents}
        sx={{ border: dragActive ? '1px dashed #696969' : 'none', py: 0.6, borderRadius: '4px' }}
      >
        <IconButton onClick={hasReceipt ? handleMenuClick : () => setOpen(true)}>
          <Iconify
            icon={hasReceipt ? 'carbon:receipt' : 'material-symbols-light:attach-file-add-rounded'}
            color={hasReceipt ? '#169B62' : '#CD5C5C'}
            width={25}
          />
        </IconButton>
        {hasReceipt && (
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleCloseMenu}>
            <MenuItem onClick={handleUpdateClick}>Update</MenuItem>
            <MenuItem onClick={handleViewClick}>View</MenuItem>
            <MenuItem onClick={handleDeleteReceipt}>Delete</MenuItem>
          </Menu>
        )}
      </Box>
    </>
  );
}
