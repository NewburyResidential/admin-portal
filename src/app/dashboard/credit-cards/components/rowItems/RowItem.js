import { useTheme } from '@mui/material/styles';
import { useRecalculateByUnit } from '../utils/useRecalculateByUnit';
import { useClearCalculations } from '../utils/useClearCalculations';
import { useFormContext, useFieldArray, useWatch, Controller } from 'react-hook-form';
import { format } from 'date-fns';

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

import Receipt from './Receipt';
import DropDownVendor from './DropDownVendor';
import CheckboxApprove from './CheckboxApprove';
import RowSubItem from '../rowSubItems/RowSubItem';
import CalculationButtonGroup from '../rowSubItems/CalculationButtonGroup';

export default function RowItem({ transaction, transactionIndex, vendors, setVendors, chartOfAccounts, recentReceipts }) {
  const { control, getValues, setValue } = useFormContext();
  const recalculateByUnit = useRecalculateByUnit();
  const clearAmounts = useClearCalculations();

  const theme = useTheme();
  const isLight = theme.palette.mode === 'light';

  const transactionChecked = useWatch({
    control,
    name: `transactions[${transactionIndex}].checked`,
  });

  const {
    fields: allocationFields,
    append,
    remove,
  } = useFieldArray({
    control,
    name: `transactions[${transactionIndex}].allocations`,
  });

  const isSplit = allocationFields.length > 1;

  const handleTransactionSplit = (allocationIndex) => {
    const calculationMethod = getValues(`transactions[${transactionIndex}].calculationMethod`);
    const { length } = allocationFields;

    if (allocationIndex === 0) {
      append({ default: false, note: '', asset: null, glAccount: null, amount: '', helper: '' });
      if (calculationMethod === 'amount') {
        const updatedAllocations = getValues(`transactions[${transactionIndex}].allocations`);
        clearAmounts(updatedAllocations, transactionIndex);
      } else {
        const updatedAllocations = getValues(`transactions[${transactionIndex}].allocations`);
        recalculateByUnit(updatedAllocations, transactionIndex, transaction.amount);
      }
    } else {
      if (length === 2) {
        setValue(`transactions[${transactionIndex}].allocations[0].amount`, transaction.amount);
        setValue(`transactions[${transactionIndex}].allocations[0].helper`, 100);
      } else if (calculationMethod === 'amount') {
        const updatedAllocations = getValues(`transactions[${transactionIndex}].allocations`);
        clearAmounts(updatedAllocations, transactionIndex);
      }
      remove(allocationIndex);
      if (calculationMethod === 'unit') {
        const updatedAllocations = getValues(`transactions[${transactionIndex}].allocations`);
        recalculateByUnit(updatedAllocations, transactionIndex, transaction.amount, allocationIndex);
      }
    }
  };

  const backgroundColor = transactionChecked
    ? isLight
      ? 'primary.lighter'
      : hexToRgba(theme.palette.primary.dark, 0.4)
    : transactionIndex % 2 !== 0
      ? isLight
        ? '#FAFBFC'
        : '#2F3944'
      : isLight
        ? '#f0f0f0'
        : '#212B36';

  const containerStyle = {
    display: 'flex',
    backgroundColor,
    pt: 2,
    pb: 3,
    pl: 2,
    alignItems: 'center',
    gap: 2,
  };

  return (
    <>
      <Box sx={containerStyle}>
        <Box sx={{ flex: '0 0 auto', pr: 2 }}>
          <CheckboxApprove transactionIndex={transactionIndex} />
        </Box>
        <Box sx={{ flex: 1.349, textAlign: 'center', pl: 2 }}>
          <DropDownVendor transactionIndex={transactionIndex} vendors={vendors} setVendors={setVendors} merchant={transaction.merchant} />
        </Box>
        <Box sx={{ flex: 1, textAlign: 'center' }}>{titleCase(transaction.name)}</Box>
        <Box sx={{ flex: 1, textAlign: 'center' }}>{transaction.accountName}</Box>
        <Box sx={{ flex: 1, textAlign: 'center', minWidth: '10%' }}>{formatDate(transaction.transactionDate)}</Box>
        <Box sx={{ flex: 0.5, textAlign: 'center' }}>
          <Receipt recentReceipts={recentReceipts} transaction={transaction} transactionIndex={transactionIndex} />
        </Box>
      </Box>

      {allocationFields.map((allocation, allocationIndex) => (
        <Box key={allocation.id}>
          <RowSubItem
            handleTransactionSplit={() => handleTransactionSplit(allocationIndex)}
            allocationFields={allocationFields}
            transactionIndex={transactionIndex}
            allocationIndex={allocationIndex}
            chartOfAccounts={chartOfAccounts}
            backgroundColor={backgroundColor}
            totalAmount={transaction.amount}
            isSplit={isSplit}
          />
        </Box>
      ))}
      {isSplit && (
        <Box sx={{ display: 'flex', backgroundColor, pb: 2, pr: 1, gap: 2 }}>
          <Box sx={{ flex: 16 }} />
          <Box sx={{ flex: 3.4, textAlign: 'center' }}>
            <CalculationButtonGroup transactionIndex={transactionIndex} totalAmount={transaction.amount} />
          </Box>
          <Box sx={{ flex: 1.52, textAlign: 'left' }}>
            <Controller
              name={`transactions[${transactionIndex}].amount`} // Replace with the appropriate field name
              control={control}
              render={({ field, fieldState: { error } }) => (
                <Box sx={{ flex: 1.52, textAlign: 'left' }}>
                  <TextField
                    {...field}
                    error={!!error}
                    label="Total"
                    InputProps={{ style: { maxHeight: '40px', color: error ? '#FB6241' : '#919EAB' } }}
                    InputLabelProps={{ style: { color: error ? '#FB6241' : '#919EAB' } }}
                    onChange={() => {
                      return null;
                    }}
                  />
                </Box>
              )}
            />
          </Box>
        </Box>
      )}
    </>
  );
}

function titleCase(str) {
  return str
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function hexToRgba(hex, opacity) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

function formatDate(dateString) {
  const [year, month, day] = dateString.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  const formattedDate = format(date, 'MM/dd/yyyy');
  return formattedDate;
}
