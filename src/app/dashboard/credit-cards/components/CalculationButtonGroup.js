import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';

import { recalculateAmountDistribution } from 'src/utils/expense-calculations/recalculate-amount-distribution';
import { recalculateUnitDistribution } from 'src/utils/expense-calculations/recalculate-unit-distribution';

export default function CalculationButtonGroup({ calculation, setCalculation, item, handleAllocationAmountChange }) {
  const handleCalculationChange = (method) => {
    setCalculation(method);
    if (method === 'Amount') {
      recalculateAmountDistribution(item, handleAllocationAmountChange);
    } else {
      recalculateUnitDistribution(item, handleAllocationAmountChange);
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
            handleCalculationChange('Amount');
          }}
          sx={{
            position: 'relative',
            color: calculation === 'Amount' ? 'white' : '#909EAB',
            backgroundColor: calculation === 'Amount' && '#666666',
            '&:hover': {
              zIndex: 1,
              backgroundColor: calculation === 'Amount' && '#666666',
            },
          }}
        >
          Amount
        </Button>
        <Button
          onClick={() => handleCalculationChange('Unit')}
          sx={{
            position: 'relative',
            color: calculation === 'Unit' ? 'white' : '#909EAB',
            backgroundColor: calculation === 'Unit' && '#666666',
            '&:hover': {
              zIndex: 1,
              backgroundColor: calculation === 'Unit' && '#666666',
            },
          }}
        >
          Unit
        </Button>
        {/* <Button
          onClick={() => handleCalculationChange('Percent')}
          sx={{
            position: 'relative',
            color: calculation === 'Percent' ? 'white' : '#909EAB',
            backgroundColor: calculation === 'Percent' && '#666666',
            '&:hover': {
              zIndex: 1,
              backgroundColor: calculation === 'Percent' && '#666666',
            },
          }}
        >
          Percent
        </Button> */}
      </ButtonGroup>
  );
}
