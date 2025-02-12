import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { copyS3Object } from 'src/utils/services/cc-expenses/uploadS3Image';
import { parse, compareAsc } from 'date-fns';
import { assetItems } from 'src/assets/data/assets';
import { useSnackbar } from 'src/utils/providers/SnackbarProvider';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Chip from '@mui/material/Chip';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';

export default function ReceiptTable({ setOpen, setLoading, id, recentReceipts, user, currentCardUsed, chartOfAccounts, totalAmount }) {
  const [filter, setFilter] = useState(currentCardUsed);
  const { setValue, getValues } = useFormContext();
  const [showUsedReceipts, setShowUsedReceipts] = useState(false);
  const { showResponseSnackbar } = useSnackbar();

  const creditCardAllowedToReview = user.creditCardAccountsToReview;

  const getCardName = (receipt) => receipt.creditCardHolder || receipt.creditCard?.name;

  let modifiedByOptions;
  if (user?.roles?.includes('admin')) {
    modifiedByOptions = [...new Set(recentReceipts.map(getCardName).filter(Boolean))];
  } else {
    modifiedByOptions = [
      ...new Set(
        recentReceipts
          .filter((receipt) => creditCardAllowedToReview.includes(getCardName(receipt)))
          .map(getCardName)
          .filter(Boolean)
      ),
    ];
  }

  const sortedReceipts = recentReceipts.sort((a, b) => {
    const dateA = new Date(a.uploadedOn);
    const dateB = new Date(b.uploadedOn);
    return compareAsc(dateB, dateA);
  });

  const filteredReceipts = filter
    ? sortedReceipts.filter((receipt) => {
        const matchesCard = getCardName(receipt) === filter;
        const isUsedReceipt = receipt.numberOfTimesUsed > 0;
        return matchesCard && (showUsedReceipts ? isUsedReceipt : !receipt.numberOfTimesUsed);
      })
    : user?.roles?.includes('admin')
      ? sortedReceipts.filter(receipt => showUsedReceipts ? (receipt.numberOfTimesUsed > 0) : (!receipt.numberOfTimesUsed))
      : sortedReceipts.filter((receipt) => {
          const isAllowedCard = creditCardAllowedToReview.includes(getCardName(receipt));
          const isUsedReceipt = receipt.numberOfTimesUsed > 0;
          return isAllowedCard && (showUsedReceipts ? isUsedReceipt : !receipt.numberOfTimesUsed);
        });

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
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      showResponseSnackbar({ severity: 'error', message: 'Error uploading file: too large' });

     
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2, mb: 2 }}>
        <Autocomplete
          disablePortal
          id="employee-filter"
          options={modifiedByOptions}
          sx={{ width: 300, marginBottom: 2, mt: 2 }}
          renderInput={(params) => <TextField {...params} label="Filter By Credit Card" />}
          value={filter}
          onChange={(event, newValue) => {
            setFilter(newValue);
          }}
          onInputChange={(event, newInputValue) => {
            if (!newInputValue) {
              setFilter('');
            }
          }}
        />
        <FormControlLabel
          control={
            <Switch
              checked={showUsedReceipts}
              onChange={(event) => setShowUsedReceipts(event.target.checked)}
            />
          }
          label="Show Used Receipts"
        />
      </Box>
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="left" style={{ width: '20%' }}>
                Merchant
              </TableCell>
              <TableCell align="center" style={{ width: '20%' }}>
                Uploaded By
              </TableCell>
              <TableCell align="center" style={{ width: '20%' }}>
                Date Uploaded
              </TableCell>
              <TableCell align="center" style={{ width: '15%' }}>
                Recognizer Amount
              </TableCell>
              {showUsedReceipts && (
                <TableCell align="center" style={{ width: '5%' }}>
                  Used
                </TableCell>
              )}
              <TableCell align="center" style={{ width: '20%', whiteSpace: 'nowrap' }} />
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredReceipts.map((row) => (
              <TableRow key={row.pk}>
                <TableCell align="left">{row.merchantName || 'No Merchant Provided'}</TableCell>
                <TableCell align="center">{getCardName(row)}</TableCell>
                <TableCell align="center">{row.uploadedOn}</TableCell>
                <TableCell align="center">{row.chargedAmount ? `$${row.chargedAmount}` : ''}</TableCell>
                {showUsedReceipts && (
                  <TableCell align="center">
                    {row.numberOfTimesUsed > 0 && (
                      <Chip 
                        label={`${row.numberOfTimesUsed} time${row.numberOfTimesUsed > 1 ? 's' : ''}`} 
                        color="info" 
                        size="small" 
                      />
                    )}
                  </TableCell>
                )}
                <TableCell align="right">
                  <Box display="flex" justifyContent="flex-end">
                    <Button
                      variant="outlined"
                      onClick={() => {
                        const encodedObjectKey = encodeURIComponent(row.s3Key ? row.s3Key : row.pk);
                        handleViewReceipt(`https://admin-portal-cc-suggested-receipts.s3.us-east-1.amazonaws.com/${encodedObjectKey}`);
                      }}
                      sx={{ marginRight: '16px', width: '100px' }}
                    >
                      View
                    </Button>
                    <Button
                      variant="contained"
                      onClick={() => {
                        handleChooseReceipt(row);
                      }}
                      sx={{ width: '100px' }}
                    >
                      Choose
                    </Button>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
