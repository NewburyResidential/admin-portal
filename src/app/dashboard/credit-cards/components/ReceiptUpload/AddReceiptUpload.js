import { useRef, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { copyS3Object, uploadS3Image } from 'src/utils/services/cc-expenses/uploadS3Image';
import { assetItems } from 'src/assets/data/assets';

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
import Chip from '@mui/material/Chip';

export default function AddReceiptUpload({ recentReceipts, setLoading, hasReceipt, transaction, isDragActive, user }) {
  //console.log('transaction', transaction);

  const { setValue, getValues } = useFormContext();
  const fileInputRef = useRef(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [open, setOpen] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [hoveredReceipt, setHoveredReceipt] = useState(null);

  const handleMenuClick = (event) => setAnchorEl(event.currentTarget);
  const handleCloseMenu = () => setAnchorEl(null);

  const suggestedReceipts = transaction.suggestedReceipts;

  const bestMatch = suggestedReceipts && suggestedReceipts.length > 0 ? suggestedReceipts[0] : null;

  const processFile = async (file) => {
    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', transaction.sk);
    formData.append('bucket', 'admin-portal-receipts');

    try {
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
    console.log('url', url);
    window.open(url, '_blank', 'noopener,noreferrer');
    handleCloseMenu();
  };

  const handleDeleteReceipt = () => {
    setValue(`receipt`, null);
    setValue(`tempPdfReceipt`, null);
  };

  const handleMatchedReceiptUpload = async (receipt) => {
    setLoading(true);
    if (receipt && receipt.allocations && receipt.allocations.length > 0) {
      console.log('receipt.allocations', receipt.allocations);
      console.log('receipt.notes', receipt);
      const updatedAllocations = receipt.allocations.map((allocation) => {
        const matchingAsset = assetItems.find((asset) => asset.accountId === allocation.asset.accountId);
        return {
          ...allocation,
          asset: matchingAsset || null,
          note: receipt.notes || '',
        };
      });
      setValue('calculationMethod', receipt.calculationMethod);
      setValue('allocations', updatedAllocations);
    }
    try {
      const response = await copyS3Object({
        sourceBucket: 'admin-portal-cc-suggested-receipts',
        destinationBucket: 'admin-portal-receipts',
        objectKey: receipt.pk,
        id: transaction.sk,
        fileExtension: receipt.fileExtension,
      });
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
      <UploadDialog
        open={open}
        setOpen={setOpen}
        setLoading={setLoading}
        transaction={transaction}
        recentReceipts={recentReceipts}
        suggestedReceipts={suggestedReceipts}
        user={user}
      />
      {hoveredReceipt && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            right: 0,
            width: '100%',
            height: '100vh',
            zIndex: 1000,
            display: 'flex',
            justifyContent: 'center',
            padding: '20px',
            backgroundColor: 'rgba(0, 0, 0, 0.03)',
          }}
        >
          <Card
            sx={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              width: '380px',
              height: 'fit-content',
              maxHeight: '70vh',
              overflow: 'auto',
              zIndex: 1001,
              px: 2,
              pt: 4,
              pb: 2,
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
            {hoveredReceipt.numberOfTimesUsed > 0 && (
              <Chip
                label={`Used ${hoveredReceipt.numberOfTimesUsed} time${hoveredReceipt.numberOfTimesUsed > 1 ? 's' : ''}`}
                color="info"
                size="small"
                sx={{
                  position: 'absolute',
                  top: 12,
                  right: 12,
                }}
              />
            )}
            <Typography variant="body2" component="p" sx={{ mb: 1, textAlign: 'center', fontWeight: 'bold' }}>
              {hoveredReceipt.modifiedBy === 'S3 Upload'
                ? 'Uploaded in S3'
                : `${hoveredReceipt.modifiedBy} uploaded ${hoveredReceipt.uploadedOn}`}
            </Typography>
            <Typography variant="body2" component="p" sx={{ fontStyle: 'italic', mb: 3, textAlign: 'center' }}>
              {hoveredReceipt?.receiptAiSummary}
            </Typography>

            {['transactionDate', 'merchant', 'total'].map((key) => {
              const value = hoveredReceipt[key];
              if (!value) return null;

              return (
                <Box
                  key={`${hoveredReceipt.pk}-${key}`}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    mb: 1,
                    backgroundColor: value.score === 1 ? '#f0f5f3' : value.score >= 0.5 ? '#FFF0E1' : '#ffebee',
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
                      {key === 'transactionDate' ? 'Transaction Date' : key.charAt(0).toUpperCase() + key.slice(1)}
                    </Box>
                    {`: ${
                      value.value === null || value.value === undefined || value.value === 'null'
                        ? ''
                        : key === 'transactionDate'
                          ? new Date(value.value).toLocaleDateString()
                          : key === 'total'
                            ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value.value)
                            : value.value
                    }`}
                  </Typography>
                  {value.score >= 1 ? (
                    <CheckCircleOutlineIcon sx={{ color: '#4caf50', ml: 2 }} />
                  ) : value.score >= 0.5 ? (
                    <HelpOutlineIcon sx={{ color: '#E97451', ml: 2 }} />
                  ) : (
                    <CancelIcon sx={{ color: '#d32f2f', ml: 2 }} />
                  )}
                </Box>
              );
            })}
          </Card>

          <Box
            sx={{
              position: 'absolute',
              right: 40,
              top: 20,
              width: '45%',
              height: '100%',
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'center',
              padding: '20px',
            }}
          >
            {hoveredReceipt.fileExtension?.toLowerCase() === 'pdf' ? (
              <iframe
                title={`Receipt PDF for ${transaction.description || 'transaction'}`}
                src={`https://admin-portal-cc-suggested-receipts.s3.us-east-1.amazonaws.com/${encodeURIComponent(hoveredReceipt.pk)}#toolbar=0&navpanes=0&scrollbar=0&view=FitV&zoom=page-actual`}
                style={{
                  height: '80vh',
                  width: '80%',
                  backgroundColor: 'white',
                  borderRadius: '8px',
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                  border: 'none',
                }}
              />
            ) : (
              /* Alternative PDF viewer using object tag
              <object
                data={`https://admin-portal-cc-suggested-receipts.s3.us-east-1.amazonaws.com/${encodeURIComponent(hoveredReceipt.pk)}`}
                type="application/pdf"
                style={{
                  height: '80vh',
                  width: '100%',
                  backgroundColor: 'white',
                  borderRadius: '8px',
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                }}
              >
                <p>Unable to display PDF. <a href={`https://admin-portal-cc-suggested-receipts.s3.us-east-1.amazonaws.com/${encodeURIComponent(hoveredReceipt.pk)}`} target="_blank" rel="noopener noreferrer">Click here to download</a></p>
              </object>
              */
              <img
                src={`https://admin-portal-cc-suggested-receipts.s3.us-east-1.amazonaws.com/${encodeURIComponent(hoveredReceipt.pk)}`}
                alt="Receipt Preview"
                style={{
                  maxHeight: '80vh',
                  width: 'auto',
                  maxWidth: '100%',
                  objectFit: 'contain',
                  objectPosition: 'center',
                  backgroundColor: 'white',
                  borderRadius: '8px',
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                }}
              />
            )}
          </Box>
        </Box>
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
              badgeContent={bestMatch ? `${bestMatch.receiptPercentTotal}%` : null}
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
          {suggestedReceipts &&
            suggestedReceipts.length > 0 &&
            !hasReceipt &&
            suggestedReceipts.map((receipt) => (
              <MenuItem
                key={receipt.pk}
                onClick={() => handleMatchedReceiptUpload(receipt)}
                onMouseEnter={() => {
                  setShowPreview(true);
                  setHoveredReceipt(receipt);
                }}
                onMouseLeave={() => {
                  setShowPreview(false);
                  setHoveredReceipt(null);
                }}
              >
                <Iconify icon="mdi:receipt-text-check" sx={{ mr: 2 }} />
                {receipt.receiptPercentTotal}% Matched Receipt
              </MenuItem>
            ))}
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
