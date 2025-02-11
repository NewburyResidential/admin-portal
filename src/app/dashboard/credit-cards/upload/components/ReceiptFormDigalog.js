import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Divider,
  Grid,
  Box,
  Typography,
  Skeleton,
  IconButton,
} from '@mui/material';
import RowSubItem from '../../components/rowSubItems/RowSubItem';
import SplitButtons from '../../components/rowItems/SplitButtons';
import ReactHookAutocomplete from 'src/components/form-inputs/ReactHookAutocomplete';
import ReactHookDatePicker from 'src/components/form-inputs/ReactHookDatePicker';
import ReactHookTextField from 'src/components/form-inputs/ReactHookTextField';
import InfoDialog from './InfoDialog';
import { useFormContext, useWatch } from 'react-hook-form';
import { useState } from 'react';
import Iconify from 'src/components/iconify';
import { useRecalculateByUnit } from '../../components/utils/useRecalculateByUnit';
import { LoadingButton } from '@mui/lab';
import { useClearCalculations } from '../../components/utils/useClearCalculations';

export default function ReceiptFormDigalog({
  open,
  onClose,
  isWaiting,
  allocationFields,
  append,
  remove,
  employeeOptions,
  chartOfAccounts,
  onSubmit,
  isUploading,
}) {
  const [openInfo, setOpenInfo] = useState(false);
  const { control, setValue, getValues, handleSubmit } = useFormContext();
  const recalculateByUnit = useRecalculateByUnit();
  const clearAmounts = useClearCalculations();

  const isSplit = allocationFields.length > 1;

  const totalAmount = useWatch({
    control,
    name: 'amount',
  });

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="xl" fullWidth>
        <DialogTitle>
          Upload Receipt
          <IconButton onClick={() => setOpenInfo(true)} sx={{ position: 'absolute', right: 10, top: 10 }}>
            <Iconify icon="material-symbols:help-rounded" width={32} color="info.dark" />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          <Typography variant="body2">
            Please verify the person&apos;s card that made the purchase. Include the date of the purchase, merchant name and the total amount
            that will be charged to the card. <strong>Please make sure these values are correct if they automatically populate.</strong>{' '}
            Specify which property the transaction is for and split the cost between multiple properties appropriately if needed. Include
            any notes about the transaction that may help with review.
          </Typography>
          <Grid container spacing={2} alignItems="center" mt={2}>
            <Grid item xs={3}>
              <ReactHookAutocomplete options={employeeOptions} name="creditCardHolder" label="Who&apos;s Card Was Charged" />
            </Grid>

            <Grid item xs={3}>
              {isWaiting ? (
                <Skeleton variant="rounded" width="100%" height={55} sx={{ borderRadius: 0.8 }} />
              ) : (
                <ReactHookDatePicker name="transactionDate" label="Date of Purchase" />
              )}
            </Grid>
            <Grid item xs={3}>
              {isWaiting ? (
                <Skeleton variant="rounded" width="100%" height={55} sx={{ borderRadius: 0.8 }} />
              ) : (
                <ReactHookTextField name="merchantName" label="Merchant Name" />
              )}
            </Grid>
            <Grid item xs={3}>
              {isWaiting ? (
                <Skeleton variant="rounded" width="100%" height={55} sx={{ borderRadius: 0.8 }} />
              ) : (
                <ReactHookTextField
                  name="amount"
                  label="Total Amount Charged"
                  onChange={(e) => {
                    // Only allow numbers, decimal points, and negative signs
                    const value = e.target.value.replace(/[^0-9.-]/g, '');
                    const sanitizedValue = value
                      .replace(/(\..*)\./g, '$1')
                      .replace(/(-.*)-/g, '$1')
                      .replace(/^(-?)0+(?=\d)/, '$1');
                    setValue('amount', sanitizedValue);

                    const calculationMethod = getValues('calculationMethod');
                    const currentAllocationFields = getValues('allocations');
                    if (currentAllocationFields.length === 1) {
                      setValue('allocations[0].amount', sanitizedValue);
                      setValue('allocations[0].helper', '100');
                    } else if (calculationMethod === 'unit') {
                      recalculateByUnit(currentAllocationFields, sanitizedValue);
                    } else {
                      clearAmounts(currentAllocationFields);
                    }
                  }}
                />
              )}
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          {allocationFields.map((allocation, allocationIndex) => (
            <Box key={allocation.id}>
              <RowSubItem
                allocationFields={allocationFields}
                allocationIndex={allocationIndex}
                backgroundColor="inherit"
                totalAmount={totalAmount}
                isSplit={isSplit}
                append={append}
                remove={remove}
                chartOfAccounts={chartOfAccounts}
                showGl
                showAmount={isSplit}
              />
            </Box>
          ))}
          {isSplit && <SplitButtons totalAmount={totalAmount} control={control} backgroundColor="inherit" />}
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <LoadingButton
            loading={isUploading}
            onClick={handleSubmit((data) => {
              onSubmit(data);
            })}
            variant="contained"
          >
            Submit Receipt
          </LoadingButton>
        </DialogActions>
      </Dialog>

      <InfoDialog open={openInfo} onClose={() => setOpenInfo(false)} />
    </>
  );
}
