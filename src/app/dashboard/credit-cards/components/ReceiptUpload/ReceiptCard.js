import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';

import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import CancelIcon from '@mui/icons-material/Cancel';

import { useFormContext } from 'react-hook-form';
import { copyS3Object } from 'src/utils/services/cc-expenses/uploadS3Image';
import { format } from 'date-fns';
import { assetItems } from 'src/assets/data/assets';
import { useSnackbar } from 'src/utils/providers/SnackbarProvider';

export default function ReceiptCards({ id, setOpen, setLoading, suggestedReceipts, chartOfAccounts, totalAmount }) {
  const { setValue } = useFormContext();
  const { showResponseSnackbar } = useSnackbar();

  const handleViewReceipt = (imageUrl) => {
    window.open(imageUrl, '_blank');
  };

  const handleChooseReceipt = async (receipt) => {
    setLoading(true);
    setOpen(false);
    if (receipt && receipt.allocations && receipt.allocations.length > 0) {
      console.log('receipt.allocations', receipt.allocations);
      const updatedAllocations = receipt.allocations.map((allocation) => {
        const matchingAsset = allocation.asset?.accountId
          ? assetItems.find((asset) => asset.accountId === allocation.asset.accountId)
          : null;
        const matchingGlAccount = allocation.glAccount?.accountId
          ? chartOfAccounts.find((glAccount) => glAccount.accountId === allocation.glAccount.accountId)
          : null;
        return {
          ...allocation,
          asset: matchingAsset || null,
          glAccount: matchingGlAccount || null,
          note: allocation.note || receipt.notes || '',
          amount: receipt.allocations.length > 1 ? allocation.amount : totalAmount,
          helper: receipt.allocations.length > 1 ? allocation.helper : '100',
        };
      });
      if (updatedAllocations.length > 1) {
        setValue('calculationMethod', receipt.calculationMethod);
      } else {
        setValue('calculationMethod', 'amount');
      }
      setValue('allocations', updatedAllocations);
    }

    try {
      const response = await copyS3Object({
        sourceBucket: 'admin-portal-cc-suggested-receipts',
        destinationBucket: 'admin-portal-receipts',
        objectKey: receipt.s3Key ? receipt.s3Key : receipt.pk,
        id,
        fileExtension: receipt.fileExtension,
      });
      if (response) {
        setValue(`receipt`, response.fileUrl);
        setValue(`tempPdfReceipt`, response.tempPdfUrl);
        setValue('suggestedReceiptReference', receipt.pk);
        showResponseSnackbar({ severity: 'error', message: 'Error uploading file: too large' });
        
      }
    } catch (error) {
      console.error('Error uploading file:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Grid container spacing={2}>
      {suggestedReceipts.map((receipt) => {
        const totalScore = receipt.scoreTotal;
        return (
          <Grid item xs={12} sm={6} md={4} key={receipt.pk}>
            <Card
              variant="outlined"
              sx={{
                height: '100%',
                borderRadius: '8px',
                display: 'flex',
                flexDirection: 'column',
                px: 2.5,
                pt: 5,
                pb: 2.5,
                border: totalScore === 1 ? '2px dashed' : '2px dashed',
                borderColor: (theme) => (theme.palette.mode === 'light' ? (totalScore >= 1 ? '#355E3B' : 'grey.400') : 'grey.700'),
                position: 'relative',
              }}
            >
              {receipt.numberOfTimesUsed > 0 && (
                <Chip
                  label={`Used ${receipt.numberOfTimesUsed} time${receipt.numberOfTimesUsed > 1 ? 's' : ''}`}
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
                {receipt.modifiedBy === 'S3 Upload' ? 'Uploaded in S3' : `${receipt.modifiedBy} uploaded ${receipt.uploadedOn}`}
              </Typography>
              <Typography variant="body2" component="p" sx={{ fontStyle: 'italic', mb: 3, textAlign: 'center' }}>
                {receipt?.receiptAiSummary}
              </Typography>

              <Box sx={{ borderRadius: '4px', flexGrow: 1 }}>
                {['transactionDate', 'merchant', 'total'].map((key) => {
                  const value = receipt[key];
                  if (!value) return null;

                  return (
                    <Box
                      key={key}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        marginBottom: '8px',
                        backgroundColor: value.score === 1 ? '#f0f5f3' : value.score >= 0.5 ? '#FFF0E1' : '#ffebee',
                        borderRadius: '8px',
                        padding: '8px 14px',
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
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '100%',
                    gap: 2,
                    mt: 3,
                  }}
                >
                  <Button
                    onClick={() => {
                      const encodedObjectKey = encodeURIComponent(receipt.s3Key ? receipt.s3Key : receipt.pk);
                      handleViewReceipt(`https://admin-portal-cc-suggested-receipts.s3.us-east-1.amazonaws.com/${encodedObjectKey}`);
                    }}
                    sx={{ px: 2, width: '100%' }}
                    variant="outlined"
                  >
                    View Receipt
                  </Button>
                  <Button
                    onClick={() => {
                      handleChooseReceipt(receipt);
                    }}
                    sx={{ px: 2, width: '100%' }}
                    variant="contained"
                  >
                    Choose Receipt
                  </Button>
                </Box>
              </Box>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );
}

function formatDate(dateString) {
  const [year, month, day] = dateString.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  const formattedDate = format(date, 'MM/dd/yyyy');
  return formattedDate;
}
