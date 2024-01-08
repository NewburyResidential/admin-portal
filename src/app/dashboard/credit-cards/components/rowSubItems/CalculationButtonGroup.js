import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import { useFormContext, useWatch } from 'react-hook-form';

import { useRecalculateByUnit } from '../utils/useRecalculateByUnit';
import { useClearCalculations } from '../utils/useClearCalculations';

export default function CalculationButtonGroup({ transactionIndex, totalAmount }) {
  const { setValue, getValues, control } = useFormContext();
  const recalculateByUnit = useRecalculateByUnit();
  const clearCalculations = useClearCalculations();

  const calculationMethod = useWatch({
    control,
    name: `transactions[${transactionIndex}].calculationMethod`,
  });

  const handleCalculationChange = (method) => {
    if (method === 'amount') {
      setValue(`transactions[${transactionIndex}].calculationMethod`, 'amount');
      const allocations = getValues(`transactions[${transactionIndex}].allocations`);
      clearCalculations(allocations, transactionIndex);
    } else {
      setValue(`transactions[${transactionIndex}].calculationMethod`, 'unit');
      const allocations = getValues(`transactions[${transactionIndex}].allocations`);
      recalculateByUnit(allocations, transactionIndex, totalAmount);
    }
  };

  return (
    <ButtonGroup
      fullWidth
      variant="outlined"
      aria-label="text button group"
      sx={{
        height: '40px',
        '& .MuiButton-outlined': {
          borderColor: '#E4E9EC',
        },
      }}
    >
      <Button
        onClick={() => {
          handleCalculationChange('amount');
        }}
        sx={{
          position: 'relative',
          color: calculationMethod === 'amount' ? 'white' : '#909EAB',
          backgroundColor: calculationMethod === 'amount' && '#666666',
          '&:hover': {
            zIndex: 1,
            backgroundColor: calculationMethod === 'amount' && '#666666',
          },
        }}
      >
        Amount
      </Button>
      <Button
        onClick={() => handleCalculationChange('unit')}
        sx={{
          position: 'relative',
          color: calculationMethod === 'unit' ? 'white' : '#909EAB',
          backgroundColor: calculationMethod === 'unit' && '#666666',
          '&:hover': {
            zIndex: 1,
            backgroundColor: calculationMethod === 'unit' && '#666666',
          },
        }}
      >
        Unit
      </Button>
    </ButtonGroup>
  );
}
