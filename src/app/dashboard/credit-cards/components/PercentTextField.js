import { TextField } from '@mui/material';
import { isIncorrectAmounts, isMissingValue } from 'src/utils/missing-value';

export default function PercentTextField({ handleAllocationAmountChange, item, allocation, amountDifference }) {
  const percentDifference = Math.round((amountDifference / item.amount) * 100);

  const message =
    percentDifference >= 0
      ? percentDifference % 1 === 0
        ? `+${percentDifference}`
        : `+${percentDifference.toFixed(2)}`
      : percentDifference % 1 === 0
      ? `-${Math.abs(percentDifference)}`
      : `-${Math.abs(percentDifference).toFixed(2)}`;

  console.log(percentDifference);
  console.log(message);
  let currentValue;
  let current;

  const allocationAmount = parseFloat(allocation.amount);
  const itemAmount = parseFloat(item.amount);

  if (!isNaN(allocationAmount)) {
    if (allocationAmount === 0) {
      currentValue = '';
    } else {
      current = Math.round((allocationAmount / itemAmount) * 100);
    }
  } else {
    currentValue = '';
  }

  const updatePercent = (newValue) => {
    if (newValue >= 1 && newValue <= 100) {
      const roundedValue = (newValue / 100) * item.amount;
      return roundedValue;
    } else {
      return;
    }
  };

  const handlePercentChange = (newValue) => {
    handleAllocationAmountChange(item.id, allocation.id, updatePercent(newValue));
  };

  return (
    <TextField
      label={amountDifference === 0 ? 'Split %' : `${message}%`}
      value={currentValue}
      onChange={(e) => handlePercentChange(e.target.value)}
      disabled={item.allocations.length === 1}
      variant="outlined"
      autoComplete="off"
      error={item?.isSubmitted && isIncorrectAmounts(item)}
    />
  );
}
