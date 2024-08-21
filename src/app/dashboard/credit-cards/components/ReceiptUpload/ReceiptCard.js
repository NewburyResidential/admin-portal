import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

import { useFormContext } from 'react-hook-form';
import { copyS3Object } from 'src/utils/services/cc-expenses/uploadS3Image';
import { format } from 'date-fns';

export default function ReceiptCards({ id, setOpen, setLoading, transactionIndex, suggestedReceipts }) {
  const { setValue } = useFormContext();

  const handleViewReceipt = (imageUrl) => {
    window.open(imageUrl, '_blank');
  };

  const handleChooseReceipt = async (objectKey, fileName) => {
    setLoading(true);
    setOpen(false);


    try {
      const response = await copyS3Object('admin-portal-suggested-receipts', 'admin-portal-receipts', objectKey, id, fileName);
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

  const calculateTotalScore = (receipt) => Object.values(receipt).reduce((acc, item) => acc + (item.score || 0), 0);
  const sortedSuggestedReceipts = suggestedReceipts.sort((a, b) => calculateTotalScore(b) - calculateTotalScore(a));

  return (
    <Grid container spacing={2}>
      {sortedSuggestedReceipts.map((receipt) => {
        const totalScore = calculateTotalScore(receipt);

        return (
          <Grid item xs={12} sm={6} md={4} key={receipt.id}>
            <Card
              variant="outlined"
              sx={{
                height: '100%',
                borderRadius: '8px',
                display: 'flex',
                flexDirection: 'column',
                padding: 2.5,
                border: totalScore === 3 ? '2px dashed' : '2px dashed',
                borderColor: (theme) => (theme.palette.mode === 'light' ? (totalScore >= 3 ? '#355E3B' : 'grey.400') : 'grey.700'),
              }}
            >
              <Typography variant="body2" component="p" sx={{ marginBottom: '8px', textAlign: 'center', fontWeight: 'bold' }}>
                {receipt.fileName}
              </Typography>
              <Typography variant="body2" component="p" sx={{ fontStyle: 'italic', marginBottom: '24px', textAlign: 'center' }}>
                {receipt.modifiedBy === 'S3 Upload' ? 'Uploaded in S3' : `${receipt.modifiedBy} on ${receipt.modifiedOn}`}
              </Typography>
              <Box sx={{ borderRadius: '4px', flexGrow: 1 }}>
                {Object.entries(receipt)
                  .filter(
                    ([key]) =>
                      key !== 'id' &&
                      key !== 'filename' &&
                      key !== 'modifiedOn' &&
                      key !== 'modifiedBy' &&
                      key !== 'fileName' &&
                      key !== 'objectKey' &&
                      key !== 'expire'
                  )
                  .map(([key, value], index, array) => (
                    <Box
                      key={key}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        marginBottom: '8px',
                        backgroundColor: value.score >= 1 ? '#f0f5f3' : value.score === 0.5 ? '#FFF0E1' : 'transparent',
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
                          {key === 'transactionDate' ? 'Transaction Date' : `${key.charAt(0).toUpperCase() + key.slice(1)}`}
                        </Box>
                        {`: ${
                          value.value === null || value.value === undefined || value.value === 'null'
                            ? ''
                            : key === 'transactionDate'
                              ? formatDate(value.value)
                              : Array.isArray(value.value)
                                ? value.value.join(', ')
                                : value.value
                        }`}
                      </Typography>
                      {value.score >= 1 ? (
                        <CheckCircleOutlineIcon sx={{ color: '#4caf50', ml: 2 }} />
                      ) : value.score === 0.5 ? (
                        <HelpOutlineIcon sx={{ color: '#E97451', ml: 2 }} />
                      ) : null}
                    </Box>
                  ))}
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
                      const encodedObjectKey = encodeURIComponent(receipt.objectKey);
                      handleViewReceipt(`https://admin-portal-suggested-receipts.s3.amazonaws.com/${encodedObjectKey}`);
                    }}
                    sx={{ px: 2, width: '100%' }}
                    variant="outlined"
                  >
                    View Receipt
                  </Button>
                  <Button
                    onClick={() => {
                      handleChooseReceipt(receipt.objectKey, receipt.fileName);
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