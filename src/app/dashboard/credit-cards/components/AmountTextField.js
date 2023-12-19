import { IconButton, TextField } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { isIncorrectAmounts, isMissingValue } from 'src/utils/missing-value';
export default function AmountTextField({ handleAllocationAmountChange, item, allocation, difference, message, isSplit }) {
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
    if (!isNaN(newValue) && newValue !== '0' || newValue === "-") {
      handleAllocationAmountChange(item.id, allocation.id, newValue);
    }
  };
  return (
    <>
      <TextField
        label={difference === 0 ? isSplit ? 'Split $' : 'Total' : `${message}`}
        value={currentValue}
        onChange={(e) => handleAmountChange(e.target.value)}
        disabled={item.allocations.length === 1}
        variant="outlined"
        autoComplete="off"
        error={item?.isSubmitted && isIncorrectAmounts(item)}
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
            const roundedValue = updatedValue % 1 === 0 ? Math.round(updatedValue / 2) * 2 : updatedValue.toFixed(2);
            handleAllocationAmountChange(item.id, allocation.id, roundedValue);
          }}
        >
          <AddCircleIcon />
        </IconButton>
      ) : null}
    </>
  );
}
