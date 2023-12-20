import { TextField } from '@mui/material';
import { isIncorrectAmounts, isMissingValue } from 'src/utils/expense-calculations/missing-value';

export default function TextFieldPercent({ handleAllocationAmountChange, item, allocation, amountDifference }) {
  const percentDifference = Math.round((amountDifference / item.amount) * 100);

  const message =
    percentDifference >= 0
      ? percentDifference % 1 === 0
        ? `+${percentDifference}`
        : `+${percentDifference.toFixed(2)}`
      : percentDifference % 1 === 0
      ? `-${Math.abs(percentDifference)}`
      : `-${Math.abs(percentDifference).toFixed(2)}`;

  let currentValue;

  const allocationAmount = parseFloat(allocation.amount);
  const itemAmount = parseFloat(item.amount);

  if (!isNaN(allocationAmount)) {
    if (allocationAmount === 0) {
      currentValue = '';
    } else {
      currentValue = Math.round((allocationAmount / itemAmount) * 100);
    }
  } else {
    currentValue = '';
  }

  const updatePercent = (newValue) => {
    if (newValue >= 1 && newValue <= 100) {
      const roundedValue = (newValue / 100) * item.amount;
      return parseFloat(roundedValue.toFixed(2));
    } else {
      return;
    }
  };

  const handlePercentChange = (newValue) => {
    handleAllocationAmountChange(item.id, allocation.id, updatePercent(newValue));
  };

  return (
    <TextField
      label={amountDifference === 0 ? 'Percent' : `${message}%`}
      value={currentValue}
      onChange={(e) => handlePercentChange(e.target.value)}
      disabled={item.allocations.length === 1}
      variant="outlined"
      autoComplete="off"
      error={item?.isSubmitted && isIncorrectAmounts(item)}
    />
  );
}
