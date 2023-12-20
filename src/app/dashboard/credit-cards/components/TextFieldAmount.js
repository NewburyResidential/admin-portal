import { IconButton, TextField } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { isIncorrectAmounts, isMissingValue } from 'src/utils/expense-calculations/missing-value';
export default function TextFieldAmount({ handleAllocationAmountChange, item, allocation, difference, message, isSplit }) {
  const allocationAmount = allocation.amount;

  const formatToTwoDecimalPlacesIfNeeded = (number) => {
    const numStr = number.toString();
    const regex = /\.\d{3,}$/;

    if (regex.test(numStr)) {
      return parseFloat(numStr).toFixed(2);
    } else {
      return numStr;
    }
  };

  const currentValue = allocationAmount ? formatToTwoDecimalPlacesIfNeeded(allocationAmount) : '';

  const handleAmountChange = (newValue) => {
    if ((!isNaN(newValue) && newValue !== '0') || newValue === '-') {
      handleAllocationAmountChange(item.id, allocation.id, newValue);
    }
  };
  console.log(difference)

  return (
    <>
      <TextField
        label={difference === 0 ? (isSplit ? 'Amount' : 'Total') : `${message}`}
        value={currentValue}
        onChange={(e) => handleAmountChange(e.target.value)}
        disabled={item.allocations.length === 1}
        variant="outlined"
        autoComplete="off"
        error={item?.isSubmitted && isIncorrectAmounts(item)}
        fullWidth={true}
      />
      {difference !== 0 ? (
        <IconButton
          sx={{
            position: 'absolute',
            right: '0px',
            transform: 'translateY(18%)',
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
      ) : null}
    </>
  );
}
