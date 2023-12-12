import { IconButton, TextField } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { isIncorrectAmounts, isMissingValue } from 'src/utils/missing-value';
export default function AmountTextField({ handleAllocationAmountChange, item, allocation, difference, message }) {
  const currentValue = allocation.amount || '';

  return (
    <>
      <TextField
        label={difference === 0 ? 'Total' : `${message}`}
        value={allocation.amount || ''}
        onChange={(e) => handleAllocationAmountChange(item.id, allocation.id, e.target.value)}
        disabled={item.allocations.length === 1}
        variant="outlined"
        autoComplete="off"
        error={item?.isSubmitted && isIncorrectAmounts(item)}
      />
      {difference !== 0 ? (
        <IconButton
          sx={{
            position: 'absolute',
            right: '2px',
            top: '50%',
            transform: 'translateY(-50%)',
          }}
          onClick={(e) => handleAllocationAmountChange(item.id, allocation.id, (difference + Number(currentValue)).toFixed(2))}
        >
          <AddCircleIcon />
        </IconButton>
      ) : null}
    </>
  );
}
