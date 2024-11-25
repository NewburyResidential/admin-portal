import { useRef, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { copyS3Object, uploadS3Image } from 'src/utils/services/cc-expenses/uploadS3Image';

import Box from '@mui/material/Box';
import Iconify from 'src/components/iconify';
import IconButton from '@mui/material/IconButton';
import UploadDialog from './UploadDialog';
import CustomPopover from 'src/components/custom-popover';
import MenuItem from '@mui/material/MenuItem';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import Badge from '@mui/material/Badge';
import CancelIcon from '@mui/icons-material/Cancel';

export default function AddReceiptUpload({ recentReceipts, setLoading, hasReceipt, transaction, isDragActive }) {
  const { setValue, getValues } = useFormContext();
  const fileInputRef = useRef(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [open, setOpen] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const handleMenuClick = (event) => setAnchorEl(event.currentTarget);
  const handleCloseMenu = () => setAnchorEl(null);

  const processFile = async (file) => {
    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', transaction.sk);
    formData.append('bucket', 'admin-portal-receipts');

   

    try {
      console.log('transaction:', transaction);

      const response = await uploadS3Image(formData);
      if (response) {
        setValue(`receipt`, response.fileUrl);
        setValue(`tempPdfReceipt`, response.tempPdfUrl);
      }
    } catch (error) {
      console.error('Error uploading file:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenUploadDialog = () => {
    setOpen(true);
    setAnchorEl(null);
  };

  const handleViewClick = () => {
    const url = getValues(`receipt`);
    window.open(url, '_blank', 'noopener,noreferrer');
    handleCloseMenu();
  };

  const handleDeleteReceipt = () => {
    setValue(`receipt`, null);
    setValue(`tempPdfReceipt`, null);
  };

  const calculateMatchPercentage = (receipt) => {
    return Math.round((receipt.scoreTotal / 3.8) * 100);
  };

  const bestMatch = transaction.bestMatchScore > 2 ? transaction.bestMatchReceipt : null;

  const handleMatchedReceiptUpload = async (objectKey, fileName) => {
    setLoading(true);
    try {
      const response = await copyS3Object('admin-portal-suggested-receipts', 'admin-portal-receipts', objectKey, transaction.sk, fileName);
      if (response) {
        setValue('receipt', response.fileUrl);
        setValue('tempPdfReceipt', response.tempPdfUrl);
      }
    } catch (error) {
      console.error('Error uploading file:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  return (
    <>
      <UploadDialog open={open} setOpen={setOpen} setLoading={setLoading} transaction={transaction} recentReceipts={recentReceipts} />
      {showPreview && bestMatch && (
        <Card
            sx={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '500px',
              maxHeight: '80vh',
              overflow: 'auto',
              zIndex: 1000,
              p: 2.5,
              boxShadow: (theme) => `
                0 0 0 2px ${theme.palette.background.paper},
                0 0 50px 20px rgba(0, 0, 0, 0.2),
                0 0 400px 100px rgba(255, 255, 255, 0.25)
              `,
              borderRadius: '8px',
              border: '2px dashed',
              borderColor: (theme) => (theme.palette.mode === 'light' ? 'grey.600' : 'grey.700'),
              backgroundColor: (theme) => theme.palette.background.paper,
              transition: 'all 0.3s ease-in-out',
            }}
          >
            <Typography variant="body2" component="p" sx={{ mb: 1, textAlign: 'center', fontWeight: 'bold' }}>
              {bestMatch.fileName}
            </Typography>
            <Typography variant="body2" component="p" sx={{ fontStyle: 'italic', mb: 3, textAlign: 'center' }}>
              {bestMatch.modifiedBy === 'S3 Upload' ? 'Uploaded in S3' : `${bestMatch.modifiedBy} on ${bestMatch.modifiedOn}`}
            </Typography>

            {Object.entries(bestMatch)
              .filter(
                ([key]) => !['id', 'filename', 'modifiedOn', 'modifiedBy', 'fileName', 'objectKey', 'expire', 'scoreTotal'].includes(key)
              )
              .map(([key, value]) => (
                <Box
                  key={key}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    mb: 1,
                    backgroundColor:
                      value.score >= 1 ? '#f0f5f3' : value.score === 0.5 ? '#FFF0E1' : value.score === 0 ? '#ffebee' : 'transparent',
                    borderRadius: '8px',
                    p: '8px 14px',
                  }}
                >
                  <Typography
                    variant="body1"
                    sx={{
                      flexGrow: 1,
                      display: 'block',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      textAlign: 'left',
                    }}
                  >
                    <Box component="span" sx={{ fontWeight: 'bold' }}>
                      {key === 'transactionDate' ? 'Transaction Date' : `${key.charAt(0).toUpperCase() + key.slice(1)}`}
                    </Box>
                    {`: ${
                      value.value === null || value.value === undefined || value.value === 'null'
                        ? ''
                        : key === 'transactionDate'
                          ? new Date(value.value).toLocaleDateString()
                          : Array.isArray(value.value)
                            ? value.value.join(', ')
                            : value.value
                    }`}
                  </Typography>
                  {value.score >= 1 ? (
                    <CheckCircleOutlineIcon sx={{ color: '#4caf50', ml: 2 }} />
                  ) : value.score === 0.5 ? (
                    <HelpOutlineIcon sx={{ color: '#E97451', ml: 2 }} />
                  ) : value.score === 0 ? (
                    <CancelIcon sx={{ color: '#d32f2f', ml: 2 }} />
                  ) : null}
                </Box>
              ))}
          </Card>
      )}
      <Box
        sx={{
          border: !hasReceipt ? '1px dashed #696969' : 'none',
          py: 0.6,
          borderRadius: '4px',
          borderColor: isDragActive ? '#FF4500' : '#696969',
          backgroundColor: isDragActive ? '#FFF5EE' : 'transparent',
        }}
      >
        <input
          type="file"
          accept="image/png,image/jpeg,application/pdf"
          style={{ display: 'none' }}
          ref={fileInputRef}
          onChange={handleFileChange}
        />

        <IconButton onClick={handleMenuClick}>
          {!hasReceipt ? (
            <Badge
              sx={{ '& .MuiBadge-badge': { fontSize: '10px', height: '20px', minWidth: '30px' } }}
              badgeContent={bestMatch ? `${calculateMatchPercentage(bestMatch)  }%` : null}
              color="success"
            >
              <Iconify
                icon={hasReceipt ? 'carbon:receipt' : 'material-symbols-light:attach-file-add-rounded'}
                color={hasReceipt ? '#169B62' : '#CD5C5C'}
                width={25}
              />
            </Badge>
          ) : (
            <Iconify icon="carbon:receipt" color="#169B62" width={25} />
          )}
        </IconButton>

        <CustomPopover open={anchorEl} onClose={handleCloseMenu} arrow="top-left" sx={{ width: 220 }}>
          {bestMatch && !hasReceipt && (
            <MenuItem
              onClick={() => handleMatchedReceiptUpload(bestMatch.objectKey, bestMatch.fileName)}
              onMouseEnter={() => setShowPreview(true)}
              onMouseLeave={() => setShowPreview(false)}
            >
              <Iconify icon="mdi:receipt-text-check" sx={{ mr: 2 }} />
              {calculateMatchPercentage(bestMatch)}% Matched Receipt
            </MenuItem>
          )}
          {hasReceipt ? (
            <>
              <MenuItem onClick={handleViewClick}>
                <Iconify icon="mdi:eye" sx={{ mr: 2 }} />
                View Receipt
              </MenuItem>
              <MenuItem onClick={handleDeleteReceipt} sx={{ color: 'error.main' }}>
                <Iconify icon="solar:trash-bin-trash-bold" sx={{ mr: 2 }} />
                Delete
              </MenuItem>
            </>
          ) : (
            <>
              <MenuItem onClick={handleOpenUploadDialog}>
                <Iconify icon="entypo:folder" sx={{ mr: 2 }} />
                View Upload Receipts
              </MenuItem>
              <MenuItem onClick={() => fileInputRef.current?.click()}>
                <Iconify icon="material-symbols:upload-file" sx={{ mr: 2 }} />
                Upload New File
              </MenuItem>
            </>
          )}
        </CustomPopover>
      </Box>
    </>
  );
}
