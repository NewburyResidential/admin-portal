import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import AddCircleIcon from '@mui/icons-material/AddCircle';

import { isIncorrectAmounts } from 'src/utils/expense-calculations/missing-value';

export default function TextFieldAmount({ handleAllocationAmountChange, item, allocation, difference, message, isSplit }) {
  const allocationAmount = allocation.amount;

  const formatToTwoDecimalPlacesIfNeeded = (number) => {
    const numStr = number.toString();
    const regex = /\.\d{3,}$/;

    if (regex.test(numStr)) {
      return numStr.toFixed(2);
    }
    return numStr;
  };

  const currentValue = allocationAmount ? formatToTwoDecimalPlacesIfNeeded(allocationAmount) : '';

  const handleAmountChange = (newValue) => {
    if ((!Number.isNaN(Number(newValue)) && newValue !== '0') || newValue === '-') {
      handleAllocationAmountChange(item.id, allocation.id, newValue);
    }
  };

  return (
    <Box sx={{ position: 'relative', width: '100%' }}>
      <TextField
        label={difference === 0 ? (isSplit ? 'Amount' : 'Total') : `${message}`}
        value={currentValue}
        onChange={(e) => handleAmountChange(e.target.value)}
        disabled={item.allocations.length === 1}
        variant="outlined"
        autoComplete="off"
        error={item?.isSubmitted && isIncorrectAmounts(item)}
        fullWidth
      />
      {difference !== 0 && (
        <IconButton
          sx={{
            position: 'absolute',
            right: '-14px',
            top: '50%',
            transform: 'translateY(-50%)',
          }}
          onClick={(e) => {
            const updatedValue = difference + Number(currentValue);
            const roundedValue = updatedValue.toFixed(2);
            console.log(roundedValue);
            handleAllocationAmountChange(item.id, allocation.id, roundedValue);
          }}
        >
          <AddCircleIcon />
        </IconButton>
      )}
    </Box>
  );
}
